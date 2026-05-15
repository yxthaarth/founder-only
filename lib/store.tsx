"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ADMIN_UID, DEFAULT_AVATAR, STORAGE_KEY, skillOptions } from "@/lib/constants";
import { syncProfileCookies } from "@/lib/cookies";
import { seedState } from "@/lib/seed";
import {
  AppState,
  Connection,
  LobbyMessage,
  Notification,
  OnboardingDraft,
  Profile,
  Startup
} from "@/lib/types";

type StoreContextValue = {
  state: AppState;
  currentUser: Profile;
  currentStartup: Startup | undefined;
  switchUser: (id: string) => void;
  updateDraft: (draft: {
    path?: OnboardingDraft["path"];
    step?: OnboardingDraft["step"];
    founder?: Partial<OnboardingDraft["founder"]>;
    builder?: Partial<OnboardingDraft["builder"]>;
  }) => void;
  setDraftStep: (step: 1 | 2 | 3) => void;
  completeBuilderOnboarding: (payload: { bio: string; skills: string[] }) => void;
  completeFounderOnboarding: (payload: {
    name: string;
    vision: string;
    github_url: string;
    demo_url: string;
  }) => void;
  sendLobbyMessage: (body: string) => LobbyMessage;
  updateProfile: (payload: { avatarUrl: string; bio: string }) => void;
  requestConnection: (receiverId: string) => void;
  acceptConnection: (requestId: string) => void;
  ignoreConnection: (requestId: string) => void;
  approveStartup: (startupId: string) => void;
  rejectStartup: (startupId: string) => void;
  addOpening: (payload: { title: string; detail: string }) => void;
  syncRealtimeMessage: (message: LobbyMessage) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

function id(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function draftTemplate(): OnboardingDraft {
  return {
    path: null,
    step: 1,
    founder: { name: "", vision: "", github_url: "", demo_url: "" },
    builder: { bio: "", skills: [] }
  };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(seedState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      setState(JSON.parse(raw) as AppState);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [ready, state]);

  const currentUser = useMemo(
    () => state.profiles.find((profile) => profile.id === state.currentUserId) ?? seedState.profiles[0],
    [state]
  );

  const currentStartup = useMemo(
    () => state.startups.find((startup) => startup.founder_id === currentUser.id),
    [currentUser.id, state.startups]
  );

  useEffect(() => {
    if (ready && currentUser) {
      syncProfileCookies(currentUser);
    }
  }, [currentUser, ready]);

  const value: StoreContextValue = {
    state,
    currentUser,
    currentStartup,
    switchUser(userId) {
      setState((current) => ({ ...current, currentUserId: userId }));
    },
    updateDraft(draft) {
      setState((current) => ({
        ...current,
        onboardingDrafts: {
          ...current.onboardingDrafts,
          [current.currentUserId]: {
            ...(current.onboardingDrafts[current.currentUserId] ?? draftTemplate()),
            ...draft,
            founder: {
              ...(current.onboardingDrafts[current.currentUserId]?.founder ?? draftTemplate().founder),
              ...(draft.founder ?? {})
            },
            builder: {
              ...(current.onboardingDrafts[current.currentUserId]?.builder ?? draftTemplate().builder),
              ...(draft.builder ?? {})
            }
          }
        }
      }));
    },
    setDraftStep(step) {
      setState((current) => ({
        ...current,
        onboardingDrafts: {
          ...current.onboardingDrafts,
          [current.currentUserId]: {
            ...(current.onboardingDrafts[current.currentUserId] ?? draftTemplate()),
            step
          }
        }
      }));
    },
    completeBuilderOnboarding(payload) {
      setState((current) => ({
        ...current,
        profiles: current.profiles.map((profile) =>
          profile.id === current.currentUserId
            ? {
                ...profile,
                role: "user",
                onboarding_status: "complete",
                bio: payload.bio,
                skills: payload.skills
              }
            : profile
        ),
        onboardingDrafts: {
          ...current.onboardingDrafts,
          [current.currentUserId]: {
            ...(current.onboardingDrafts[current.currentUserId] ?? draftTemplate()),
            path: "builder",
            step: 3,
            builder: payload
          }
        }
      }));
    },
    completeFounderOnboarding(payload) {
      setState((current) => ({
        ...current,
        profiles: current.profiles.map((profile) =>
          profile.id === current.currentUserId
            ? {
                ...profile,
                role: "founder",
                onboarding_status: "complete",
                bio: payload.vision,
                is_verified: false
              }
            : profile
        ),
        startups: [
          {
            id: id("startup"),
            founder_id: current.currentUserId,
            name: payload.name,
            pitch: payload.vision,
            github_url: payload.github_url,
            demo_url: payload.demo_url,
            status: "pending",
            members: [current.currentUserId],
            milestones: [
              { label: "Build", progress: 42 },
              { label: "Pilot", progress: 18 },
              { label: "Funding", progress: 6 }
            ],
            openings: []
          },
          ...current.startups
        ],
        onboardingDrafts: {
          ...current.onboardingDrafts,
          [current.currentUserId]: {
            ...(current.onboardingDrafts[current.currentUserId] ?? draftTemplate()),
            path: "founder",
            step: 3,
            founder: payload
          }
        }
      }));
    },
    sendLobbyMessage(body) {
      const message: LobbyMessage = {
        id: id("msg"),
        userId: currentUser.id,
        body,
        createdAt: new Date().toISOString()
      };
      setState((current) => ({
        ...current,
        lobbyMessages: [...current.lobbyMessages, message]
      }));
      return message;
    },
    syncRealtimeMessage(message) {
      setState((current) => {
        if (current.lobbyMessages.some((entry) => entry.id === message.id)) {
          return current;
        }

        return {
          ...current,
          lobbyMessages: [...current.lobbyMessages, message]
        };
      });
    },
    updateProfile(payload) {
      setState((current) => ({
        ...current,
        profiles: current.profiles.map((profile) =>
          profile.id === current.currentUserId ? { ...profile, ...payload } : profile
        )
      }));
    },
    requestConnection(receiverId) {
      if (currentUser.id === receiverId) return;
      const exists = state.connections.some(
        (connection) =>
          (connection.sender_id === currentUser.id && connection.receiver_id === receiverId) ||
          (connection.sender_id === receiverId && connection.receiver_id === currentUser.id)
      );
      if (exists) return;

      const request: Connection = {
        id: id("request"),
        sender_id: currentUser.id,
        receiver_id: receiverId,
        status: "pending"
      };

      const notification: Notification = {
        id: id("notice"),
        type: "connection_request",
        userId: receiverId,
        actorId: currentUser.id,
        requestId: request.id,
        message: `${currentUser.name} requested access.`,
        read: false
      };

      setState((current) => ({
        ...current,
        connections: [request, ...current.connections],
        notifications: [notification, ...current.notifications]
      }));
    },
    acceptConnection(requestId) {
      setState((current) => ({
        ...current,
        connections: current.connections.map((connection) =>
          connection.id === requestId ? { ...connection, status: "accepted" } : connection
        ),
        notifications: current.notifications.map((notification) =>
          notification.requestId === requestId ? { ...notification, read: true } : notification
        )
      }));
    },
    ignoreConnection(requestId) {
      setState((current) => ({
        ...current,
        connections: current.connections.filter((connection) => connection.id !== requestId),
        notifications: current.notifications.map((notification) =>
          notification.requestId === requestId ? { ...notification, read: true } : notification
        )
      }));
    },
    approveStartup(startupId) {
      setState((current) => {
        const startup = current.startups.find((entry) => entry.id === startupId);
        if (!startup) return current;

        return {
          ...current,
          startups: current.startups.map((entry) =>
            entry.id === startupId ? { ...entry, status: "verified" } : entry
          ),
          profiles: current.profiles.map((profile) =>
            profile.id === startup.founder_id
              ? { ...profile, role: "founder", is_verified: true }
              : profile
          )
        };
      });
    },
    rejectStartup(startupId) {
      setState((current) => {
        const startup = current.startups.find((entry) => entry.id === startupId);
        if (!startup) return current;

        return {
          ...current,
          startups: current.startups.filter((entry) => entry.id !== startupId),
          profiles: current.profiles.map((profile) =>
            profile.id === startup.founder_id
              ? { ...profile, role: "user", is_verified: false }
              : profile
          ),
          notifications: [
            {
              id: id("notice"),
              type: "submission_rejected",
              userId: startup.founder_id,
              message: "Your startup submission was rejected.",
              read: false
            },
            ...current.notifications
          ]
        };
      });
    },
    addOpening(payload) {
      setState((current) => ({
        ...current,
        startups: current.startups.map((startup) =>
          startup.founder_id === current.currentUserId
            ? {
                ...startup,
                openings: [...startup.openings, { id: id("opening"), ...payload }]
              }
            : startup
        )
      }));
    }
  };

  useEffect(() => {
    if (!ready) return;
    setState((current) => {
      if (current.profiles.some((profile) => profile.id === ADMIN_UID)) {
        return current;
      }
      return {
        ...current,
        profiles: [
          ...current.profiles,
          {
            id: ADMIN_UID,
            email: "admin@xlr8ter.dev",
            name: "System Admin",
            bio: "Admin access for queue review.",
            avatarUrl: DEFAULT_AVATAR,
            role: "admin",
            onboarding_status: "complete",
            is_verified: true,
            skills: skillOptions.slice(5, 6)
          }
        ]
      };
    });
  }, [ready]);

  if (!ready) {
    return <div className="min-h-screen bg-bg" />;
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return context;
}
