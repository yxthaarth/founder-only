"use client";

import { useMemo } from "react";
import { useStore } from "@/lib/store";

export function ToastStack() {
  const { state, currentUser } = useStore();
  const rejection = useMemo(
    () =>
      state.notifications.find(
        (item) => item.userId === currentUser.id && item.type === "submission_rejected" && !item.read
      ),
    [currentUser.id, state.notifications]
  );

  if (!rejection) return null;

  return (
    <div className="fixed right-4 top-4 z-40 rounded-[4px] border border-line bg-surface px-4 py-3 shadow-lg">
      <p className="text-sm text-white">{rejection.message}</p>
    </div>
  );
}
