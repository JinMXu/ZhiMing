"use client";

import { useSyncExternalStore } from "react";
import { factsSummary, type ReadingFacts } from "./divine/facts";

/**
 * 测算记录：存在本机浏览器 localStorage，不上传服务器。
 * 最多保留 50 条，超出丢弃最旧的。
 */
export interface ReadingRecord {
  id: string;
  kind: ReadingFacts["kind"];
  title: string;
  facts: ReadingFacts;
  text: string;
  createdAt: number;
}

const KEY = "suanming:records";
const CHANGE_EVENT = "suanming:records-changed";
const MAX = 50;

// useSyncExternalStore 的 snapshot 必须引用稳定：按原始字符串缓存解析结果
let cachedRaw: string | null | undefined;
let cachedRecords: ReadingRecord[] = [];

function parse(raw: string | null): ReadingRecord[] {
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ReadingRecord[];
  } catch {
    return [];
  }
}

function getSnapshot(): ReadingRecord[] {
  const raw = localStorage.getItem(KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedRecords = parse(raw);
  }
  return cachedRecords;
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange); // 其他标签页的改动
  window.addEventListener(CHANGE_EVENT, onChange); // 本标签页的写入
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function notify(): void {
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** 读取记录列表；服务端/首帧返回 null（避免 hydration 不一致） */
export function useRecords(): ReadingRecord[] | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

export function listRecords(): ReadingRecord[] {
  if (typeof window === "undefined") return [];
  return getSnapshot();
}

export function saveRecord(facts: ReadingFacts, text: string): void {
  const records = listRecords();
  records.unshift({
    id: crypto.randomUUID(),
    kind: facts.kind,
    title: factsSummary(facts),
    facts,
    text,
    createdAt: Date.now(),
  });
  try {
    localStorage.setItem(KEY, JSON.stringify(records.slice(0, MAX)));
    notify();
  } catch {
    // 存储已满或不可用时不影响阅读
  }
}

export function removeRecord(id: string): void {
  const records = listRecords().filter((r) => r.id !== id);
  localStorage.setItem(KEY, JSON.stringify(records));
  notify();
}

export function clearRecords(): void {
  localStorage.removeItem(KEY);
  notify();
}
