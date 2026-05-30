"use client";

import { useMemo, useSyncExternalStore } from "react";

import type { CreditProfile } from "@/lib/creditEngine";
import {
  financialSnapshotChangedEvent,
  parseFinancialSnapshotRaw,
  readFinancialSnapshotRaw,
  snapshotToCreditProfile,
  snapshotToLendingProfile,
} from "@/lib/financialSnapshot";
import type { LendingProfile } from "@/lib/lendingEngine";

function subscribeToSnapshot(listener: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", listener);
  window.addEventListener(financialSnapshotChangedEvent, listener);

  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(financialSnapshotChangedEvent, listener);
  };
}

function getClientSnapshot() {
  return readFinancialSnapshotRaw();
}

function getServerSnapshot() {
  return "";
}

export function useFinancialSnapshot() {
  const raw = useSyncExternalStore(
    subscribeToSnapshot,
    getClientSnapshot,
    getServerSnapshot,
  );

  return useMemo(() => parseFinancialSnapshotRaw(raw), [raw]);
}

export function useFinancialSnapshotProfile(fallback: CreditProfile) {
  const snapshot = useFinancialSnapshot();

  return useMemo(
    () => snapshotToCreditProfile(snapshot, fallback),
    [fallback, snapshot],
  );
}

export function useFinancialSnapshotLendingProfile(fallback: LendingProfile) {
  const snapshot = useFinancialSnapshot();

  return useMemo(
    () => snapshotToLendingProfile(snapshot, fallback),
    [fallback, snapshot],
  );
}
