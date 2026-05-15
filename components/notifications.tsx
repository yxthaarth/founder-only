"use client";

import { Button, Panel } from "@/components/ui";
import { useStore } from "@/lib/store";

export function NotificationsPanel() {
  const { state, currentUser, acceptConnection, ignoreConnection } = useStore();
  const notifications = state.notifications.filter((item) => item.userId === currentUser.id && !item.read);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <Panel className="p-4">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-white">Notifications</h3>
        </div>
        {notifications.map((notification) => (
          <div key={notification.id} className="space-y-3 border-t border-line pt-4 first:border-t-0 first:pt-0">
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
          </div>
        ))}
      </div>
    </Panel>
  );
}
