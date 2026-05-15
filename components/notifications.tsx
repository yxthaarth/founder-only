"use client";

import { Button, Panel } from "@/components/ui";
import { useStore } from "@/lib/store";

export function NotificationsPanel() {
  const { state, currentUser, acceptConnection, ignoreConnection } = useStore();
  const notifications = state.notifications.filter((item) => item.userId === currentUser.id && !item.read);

  if (notifications.length === 0) {
    return (
      <Panel className="p-4">
        <p className="text-sm text-zinc-500">No active notifications.</p>
      </Panel>
    );
  }

  return (
    <Panel className="p-4">
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="space-y-3 border-b border-line pb-4 last:border-b-0 last:pb-0">
            <p className="text-sm text-white">{notification.message}</p>
            {notification.type === "connection_request" && notification.requestId ? (
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => acceptConnection(notification.requestId!)}>
                  Accept
                </Button>
                <Button variant="ghost" onClick={() => ignoreConnection(notification.requestId!)}>
                  Ignore
                </Button>
              </div>
            ) : null}
            {notification.type === "submission_rejected" ? (
              <p className="text-xs text-zinc-500">Queue update received.</p>
            ) : null}
          </div>
        ))}
      </div>
    </Panel>
  );
}
