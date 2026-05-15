"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  ADMIN_UID,
  DEFAULT_AVATAR,
  DEFAULT_BANNER,
  LOGIN_PATH,
  STORAGE_KEY,
  skillOptions
} from "@/lib/constants";
import { clearAuthCookies, syncProfileCookies } from "@/lib/cookies";
import { seedState } from "@/lib/seed";
import {
  AppState,
  Connection,
  Contribution,
  DirectMessage,
  DirectMessageThread,
  EducationEntry,
  ExperienceEntry,
  FundingCampaign,
  GroupMessage,
  LobbyMessage,
  Notification,
  OnboardingDraft,
  Profile,
  Startup,
  StartupUpdateComment,
  StartupUpdatePost
} from "@/lib/types";

type StoreContextValue = {
  state: AppState;
  currentUser: Profile;
  currentStartup: Startup | undefined;
  currentCampaign: FundingCampaign | undefined;
  isAuthenticated: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  hydrateGoogleUser: (payload: { email: string; name: string; avatarUrl?: string }) => void;
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
  syncRealtimeMessage: (message: LobbyMessage) => void;
  toggleLobbyLike: (messageId: string) => void;
  replyToLobbyMessage: (payload: { messageId: string; body: string }) => LobbyMessage | null;
  repostLobbyMessage: (messageId: string) => LobbyMessage | null;
  deleteLobbyMessage: (messageId: string) => void;
  updateProfile: (payload: {
    avatarUrl: string;
    bannerUrl: string;
    bio: string;
    education: EducationEntry[];
    experience: ExperienceEntry[];
    skills: string[];
  }) => void;
  requestConnection: (receiverId: string, mode?: "network" | "message") => void;
  acceptConnection: (requestId: string) => void;
  ignoreConnection: (requestId: string) => void;
  openDirectMessageThread: (userId: string) => string | null;
  joinGroup: (groupId: string) => void;
  createGroup: (payload: { name: string; description: string; focus: string }) => string;
  sendGroupMessage: (payload: { groupId: string; body: string }) => void;
  approveStartup: (startupId: string) => void;
  rejectStartup: (startupId: string) => void;
  addOpening: (payload: { title: string; detail: string }) => void;
  deleteOpening: (openingId: string) => void;
  applyToOpening: (payload: { openingId: string; note: string }) => void;
  updateApplicationStatus: (payload: { applicationId: string; status: "accepted" | "rejected" | "follow_up" }) => void;
  createFollowUpThread: (payload: { applicationId: string; openingId: string; body: string }) => string | null;
  sendDirectMessage: (payload: { threadId: string; body: string }) => void;
  setHiringAccess: (payload: { startupId: string; userId: string; enabled: boolean }) => void;
  addEmployeeAccess: (payload: {
    startupId: string;
    userId: string;
    title: string;
    canManageJobs: boolean;
    canManageCrowdfund: boolean;
    canManagePeople: boolean;
    canPostUpdates: boolean;
  }) => void;
  createStartupPost: (payload: { title: string; body: string }) => void;
  addStartupComment: (payload: { postId: string; body: string }) => void;
  createCampaign: (payload: {
    target_amount: number;
    deadline: string;
    milestone: string;
    reason: string;
  }) => void;
  deleteCampaign: (campaignId: string) => void;
  backCampaign: (payload: { campaignId: string; amount: number }) => void;
  freezeCampaign: (campaignId: string) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

function id(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function draftTemplate(): OnboardingDraft {
  return {
    path: null,
    step: 1,
    founder: { name: "", vision: "", github_url: "", demo_url: "" },
    builder: { bio: "", skills: [] }
  };
}

function normalizeState(raw: Partial<AppState>): AppState {
  return {
    currentUserId: raw.currentUserId ?? seedState.currentUserId,
    profiles: Array.isArray(raw.profiles)
      ? raw.profiles.map((profile) => {
          const normalizedProfile = {
            ...profile,
            bio: profile.bio ?? "",
            avatarUrl: profile.avatarUrl ?? DEFAULT_AVATAR,
            bannerUrl: profile.bannerUrl ?? DEFAULT_BANNER,
            education: Array.isArray(profile.education) ? profile.education : [],
            experience: Array.isArray(profile.experience) ? profile.experience : [],
            skills: Array.isArray(profile.skills) ? profile.skills : []
          };
          return normalizedProfile;
        })
      : seedState.profiles,
    startups: Array.isArray(raw.startups)
      ? raw.startups.map((startup) => {
          const normalizedStartup = {
            ...startup,
            imageUrl: startup.imageUrl ?? DEFAULT_BANNER,
            members: Array.isArray(startup.members) ? startup.members : [],
            hiring_manager_ids: Array.isArray(startup.hiring_manager_ids) ? startup.hiring_manager_ids : [],
            crowdfund_manager_ids: Array.isArray(startup.crowdfund_manager_ids) ? startup.crowdfund_manager_ids : [],
            people_manager_ids: Array.isArray(startup.people_manager_ids) ? startup.people_manager_ids : [],
            update_manager_ids: Array.isArray(startup.update_manager_ids) ? startup.update_manager_ids : [],
            teamRoles: Array.isArray(startup.teamRoles) ? startup.teamRoles : [],
            openings: Array.isArray(startup.openings) ? startup.openings : []
          };
          return normalizedStartup;
        })
      : seedState.startups,
    funding_campaigns: Array.isArray(raw.funding_campaigns) ? raw.funding_campaigns : seedState.funding_campaigns,
    contributions: Array.isArray(raw.contributions) ? raw.contributions : seedState.contributions,
    jobApplications: Array.isArray(raw.jobApplications) ? raw.jobApplications : seedState.jobApplications,
    dmThreads: Array.isArray(raw.dmThreads) ? raw.dmThreads : seedState.dmThreads,
    dmMessages: Array.isArray(raw.dmMessages) ? raw.dmMessages : seedState.dmMessages,
    connections: Array.isArray(raw.connections) ? raw.connections : seedState.connections,
    notifications: Array.isArray(raw.notifications) ? raw.notifications : seedState.notifications,
    lobbyMessages: Array.isArray(raw.lobbyMessages)
      ? raw.lobbyMessages.map((message) => ({
          ...message,
          likedBy: Array.isArray(message.likedBy) ? message.likedBy : []
        }))
      : seedState.lobbyMessages,
    groups: Array.isArray(raw.groups) ? raw.groups : seedState.groups,
    groupMessages: Array.isArray(raw.groupMessages) ? raw.groupMessages : seedState.groupMessages,
    startupPosts: Array.isArray(raw.startupPosts) ? raw.startupPosts : seedState.startupPosts,
    startupComments: Array.isArray(raw.startupComments) ? raw.startupComments : seedState.startupComments,
    onboardingDrafts:
      raw.onboardingDrafts && typeof raw.onboardingDrafts === "object"
        ? raw.onboardingDrafts
        : seedState.onboardingDrafts
  };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(seedState);
  const [ready, setReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const auth = window.localStorage.getItem("xlr8ter-auth");
    if (raw) {
      setState(normalizeState(JSON.parse(raw) as Partial<AppState>));
    }
    setIsAuthenticated(auth === "1");
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
    () => state.startups.find((startup) => startup.founder_id === currentUser.id || startup.members.includes(currentUser.id)),
    [currentUser.id, state.startups]
  );

  const currentCampaign = useMemo(
    () =>
      currentStartup
        ? (state.funding_campaigns ?? []).find((campaign) => campaign.startup_id === currentStartup.id)
        : undefined,
    [currentStartup, state.funding_campaigns]
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
    currentCampaign,
    isAuthenticated,
    async loginWithGoogle() {
      window.localStorage.setItem("xlr8ter-auth", "1");
      setIsAuthenticated(true);
      const pendingGoogleProfile = window.localStorage.getItem("xlr8ter-google-user");
      if (!pendingGoogleProfile) {
        const googleUser = {
          email: "founder@xlr8ter.dev",
          name: "Iris Vale",
          avatarUrl: DEFAULT_AVATAR
        };
        window.localStorage.setItem("xlr8ter-google-user", JSON.stringify(googleUser));
      }
    },
    logout() {
      window.localStorage.removeItem("xlr8ter-auth");
      clearAuthCookies();
      setIsAuthenticated(false);
      window.location.href = LOGIN_PATH;
    },
    hydrateGoogleUser(payload) {
      setState((current) => {
        const existing = current.profiles.find((profile) => profile.email === payload.email);
        if (existing) {
          return { ...current, currentUserId: existing.id };
        }

        const newId = id("user");
        return {
          ...current,
          currentUserId: newId,
          profiles: [
            {
              id: newId,
              email: payload.email,
              name: payload.name,
              bio: "",
              avatarUrl: payload.avatarUrl ?? DEFAULT_AVATAR,
              bannerUrl: DEFAULT_BANNER,
              education: [],
              experience: [],
              role: "user",
              onboarding_status: "partial",
              is_verified: false,
              skills: []
            },
            ...current.profiles
          ],
          onboardingDrafts: {
            ...current.onboardingDrafts,
            [newId]: draftTemplate()
          }
        };
      });
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
            imageUrl: DEFAULT_BANNER,
            github_url: payload.github_url,
            demo_url: payload.demo_url,
            status: "pending",
            members: [current.currentUserId],
            hiring_manager_ids: [current.currentUserId],
            crowdfund_manager_ids: [current.currentUserId],
            people_manager_ids: [current.currentUserId],
            update_manager_ids: [current.currentUserId],
            teamRoles: [{ userId: current.currentUserId, title: "Founder" }],
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
        createdAt: new Date().toISOString(),
        likedBy: []
      };
      setState((current) => ({
        ...current,
        lobbyMessages: [...current.lobbyMessages, message]
      }));
      return message;
    },
    syncRealtimeMessage(message) {
      setState((current) => {
        if (current.lobbyMessages.some((entry) => entry.id === message.id)) return current;
        return { ...current, lobbyMessages: [...current.lobbyMessages, message] };
      });
    },
    toggleLobbyLike(messageId) {
      setState((current) => ({
        ...current,
        lobbyMessages: current.lobbyMessages.map((message) =>
          message.id === messageId
            ? {
                ...message,
                likedBy: message.likedBy.includes(current.currentUserId)
                  ? message.likedBy.filter((id) => id !== current.currentUserId)
                  : [...message.likedBy, current.currentUserId]
              }
            : message
        )
      }));
    },
    replyToLobbyMessage(payload) {
      if (!payload.body.trim()) return null;
      const message: LobbyMessage = {
        id: id("msg"),
        userId: currentUser.id,
        body: payload.body,
        createdAt: new Date().toISOString(),
        likedBy: [],
        replyToId: payload.messageId
      };
      setState((current) => ({
        ...current,
        lobbyMessages: [...current.lobbyMessages, message]
      }));
      return message;
    },
    repostLobbyMessage(messageId) {
      const original = state.lobbyMessages.find((message) => message.id === messageId);
      if (!original) return null;
      const existing = state.lobbyMessages.find(
        (message) => message.userId === currentUser.id && message.repostOfId === messageId
      );
      if (existing) return existing;
      const message: LobbyMessage = {
        id: id("msg"),
        userId: currentUser.id,
        body: "",
        createdAt: new Date().toISOString(),
        likedBy: [],
        repostOfId: messageId
      };
      setState((current) => ({
        ...current,
        lobbyMessages: [...current.lobbyMessages, message]
      }));
      return message;
    },
    deleteLobbyMessage(messageId) {
      setState((current) => {
        const target = current.lobbyMessages.find((message) => message.id === messageId);
        if (!target || target.userId !== current.currentUserId) return current;
        return {
          ...current,
          lobbyMessages: current.lobbyMessages.filter(
            (message) =>
              message.id !== messageId &&
              message.replyToId !== messageId &&
              message.repostOfId !== messageId
          )
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
    requestConnection(receiverId, mode = "network") {
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
        message:
          mode === "message"
            ? `${currentUser.name} sent you a message request.`
            : `${currentUser.name} wants to join your network.`,
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
    openDirectMessageThread(userId) {
      if (userId === currentUser.id) return null;
      const sharedStartup = state.startups.some(
        (startup) => startup.members.includes(currentUser.id) && startup.members.includes(userId)
      );
      const connected = state.connections.some(
        (connection) =>
          connection.status === "accepted" &&
          ((connection.sender_id === currentUser.id && connection.receiver_id === userId) ||
            (connection.sender_id === userId && connection.receiver_id === currentUser.id))
      );
      if (!sharedStartup && !connected) return null;

      const existing = state.dmThreads.find(
        (thread) =>
          !thread.applicationId &&
          thread.participantIds.length === 2 &&
          thread.participantIds.includes(currentUser.id) &&
          thread.participantIds.includes(userId)
      );
      if (existing) return existing.id;

      const threadId = id("thread");
      const thread: DirectMessageThread = {
        id: threadId,
        participantIds: [currentUser.id, userId],
        createdAt: new Date().toISOString()
      };

      setState((current) => ({
        ...current,
        dmThreads: [thread, ...current.dmThreads]
      }));

      return threadId;
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
    joinGroup(groupId) {
      setState((current) => ({
        ...current,
        groups: current.groups.map((group) =>
          group.id === groupId
            ? {
                ...group,
                memberIds: group.memberIds.includes(current.currentUserId)
                  ? group.memberIds
                  : [...group.memberIds, current.currentUserId]
              }
            : group
        )
      }));
    },
    createGroup(payload) {
      const groupId = id("group");
      setState((current) => ({
        ...current,
        groups: [
          {
            id: groupId,
            name: payload.name,
            description: payload.description,
            focus: payload.focus,
            memberIds: [current.currentUserId]
          },
          ...current.groups
        ]
      }));
      return groupId;
    },
    sendGroupMessage(payload) {
      const targetGroup = state.groups.find((group) => group.id === payload.groupId);
      if (!targetGroup || !targetGroup.memberIds.includes(currentUser.id) || !payload.body.trim()) return;

      const message: GroupMessage = {
        id: id("group-msg"),
        groupId: payload.groupId,
        userId: currentUser.id,
        body: payload.body,
        createdAt: new Date().toISOString()
      };

      setState((current) => ({
        ...current,
        groupMessages: [...current.groupMessages, message]
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
            profile.id === startup.founder_id ? { ...profile, role: "founder", is_verified: true } : profile
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
          funding_campaigns: current.funding_campaigns.filter((campaign) => campaign.startup_id !== startupId),
          startupPosts: current.startupPosts.filter((post) => post.startupId !== startupId),
          startupComments: current.startupComments.filter((comment) =>
            current.startupPosts.some((post) => post.id === comment.postId && post.startupId === startupId)
              ? false
              : true
          ),
          profiles: current.profiles.map((profile) =>
            profile.id === startup.founder_id ? { ...profile, role: "user", is_verified: false } : profile
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
          startup.founder_id === current.currentUserId ||
          startup.hiring_manager_ids.includes(current.currentUserId)
            ? { ...startup, openings: [...startup.openings, { id: id("opening"), ...payload }] }
            : startup
        )
      }));
    },
    deleteOpening(openingId) {
      setState((current) => ({
        ...current,
        startups: current.startups.map((startup) => ({
          ...startup,
          openings: startup.openings.filter((opening) => opening.id !== openingId)
        })),
        jobApplications: current.jobApplications.filter((application) => application.openingId !== openingId)
      }));
    },
    applyToOpening(payload) {
      setState((current) => ({
        ...current,
        jobApplications: [
          {
            id: id("apply"),
            openingId: payload.openingId,
            userId: current.currentUserId,
            note: payload.note,
            createdAt: new Date().toISOString(),
            status: "pending"
          },
          ...current.jobApplications
        ]
      }));
    },
    updateApplicationStatus(payload) {
      setState((current) => ({
        ...current,
        jobApplications: current.jobApplications.map((application) =>
          application.id === payload.applicationId ? { ...application, status: payload.status } : application
        )
      }));
    },
    createFollowUpThread(payload) {
      const application = state.jobApplications.find((entry) => entry.id === payload.applicationId);
      if (!application) return null;
      const openingStartup = state.startups.find((startup) =>
        startup.openings.some((opening) => opening.id === payload.openingId)
      );
      if (!openingStartup) return null;

      const existing = state.dmThreads.find((thread) => thread.applicationId === payload.applicationId);
      if (existing) {
        setState((current) => ({
          ...current,
          jobApplications: current.jobApplications.map((entry) =>
            entry.id === payload.applicationId ? { ...entry, status: "follow_up" } : entry
          ),
          dmMessages: [
            ...current.dmMessages,
            {
              id: id("dm"),
              threadId: existing.id,
              senderId: current.currentUserId,
              body: payload.body,
              createdAt: new Date().toISOString()
            }
          ]
        }));
        return existing.id;
      }

      const threadId = id("thread");
      const thread: DirectMessageThread = {
        id: threadId,
        participantIds: [currentUser.id, application.userId],
        applicationId: payload.applicationId,
        startupId: openingStartup.id,
        createdAt: new Date().toISOString()
      };
      const message: DirectMessage = {
        id: id("dm"),
        threadId,
        senderId: currentUser.id,
        body: payload.body,
        createdAt: new Date().toISOString()
      };

      setState((current) => ({
        ...current,
        jobApplications: current.jobApplications.map((entry) =>
          entry.id === payload.applicationId ? { ...entry, status: "follow_up" } : entry
        ),
        dmThreads: [thread, ...current.dmThreads],
        dmMessages: [...current.dmMessages, message]
      }));
      return threadId;
    },
    sendDirectMessage(payload) {
      setState((current) => ({
        ...current,
        dmMessages: [
          ...current.dmMessages,
          {
            id: id("dm"),
            threadId: payload.threadId,
            senderId: current.currentUserId,
            body: payload.body,
            createdAt: new Date().toISOString()
          }
        ]
      }));
    },
    setHiringAccess(payload) {
      setState((current) => ({
        ...current,
        startups: current.startups.map((startup) => {
          if (startup.id !== payload.startupId || startup.founder_id !== current.currentUserId) {
            return startup;
          }

          return {
            ...startup,
            hiring_manager_ids: payload.enabled
              ? Array.from(new Set([...startup.hiring_manager_ids, payload.userId]))
              : startup.hiring_manager_ids.filter((id) => id !== payload.userId || id === startup.founder_id)
          };
        })
      }));
    },
    addEmployeeAccess(payload) {
      setState((current) => ({
        ...current,
        startups: current.startups.map((startup) => {
          if (startup.id !== payload.startupId) return startup;
          const canManagePeople =
            startup.founder_id === current.currentUserId || startup.people_manager_ids.includes(current.currentUserId);
          if (!canManagePeople) return startup;

          const nextMembers = startup.members.includes(payload.userId)
            ? startup.members
            : [...startup.members, payload.userId];

          const nextTeamRoles = startup.teamRoles.some((role) => role.userId === payload.userId)
            ? startup.teamRoles.map((role) =>
                role.userId === payload.userId ? { ...role, title: payload.title } : role
              )
            : [...startup.teamRoles, { userId: payload.userId, title: payload.title }];

          const updatePermissionList = (ids: string[], enabled: boolean) =>
            enabled ? Array.from(new Set([...ids, payload.userId])) : ids.filter((id) => id !== payload.userId);

          return {
            ...startup,
            members: nextMembers,
            teamRoles: nextTeamRoles,
            hiring_manager_ids: updatePermissionList(startup.hiring_manager_ids, payload.canManageJobs),
            crowdfund_manager_ids: updatePermissionList(
              startup.crowdfund_manager_ids,
              payload.canManageCrowdfund
            ),
            people_manager_ids: updatePermissionList(startup.people_manager_ids, payload.canManagePeople),
            update_manager_ids: updatePermissionList(startup.update_manager_ids, payload.canPostUpdates)
          };
        })
      }));
    },
    createStartupPost(payload) {
      setState((current) => {
        const startup = current.startups.find(
          (entry) =>
            entry.founder_id === current.currentUserId ||
            (entry.members.includes(current.currentUserId) && entry.update_manager_ids.includes(current.currentUserId))
        );
        if (!startup || !payload.title.trim() || !payload.body.trim()) return current;

        const post: StartupUpdatePost = {
          id: id("post"),
          startupId: startup.id,
          authorId: current.currentUserId,
          title: payload.title,
          body: payload.body,
          createdAt: new Date().toISOString()
        };

        return {
          ...current,
          startupPosts: [post, ...current.startupPosts]
        };
      });
    },
    addStartupComment(payload) {
      if (!payload.body.trim()) return;
      const comment: StartupUpdateComment = {
        id: id("comment"),
        postId: payload.postId,
        userId: currentUser.id,
        body: payload.body,
        createdAt: new Date().toISOString()
      };

      setState((current) => ({
        ...current,
        startupComments: [...current.startupComments, comment]
      }));
    },
    createCampaign(payload) {
      setState((current) => {
        const startup = current.startups.find(
          (entry) =>
            entry.founder_id === current.currentUserId ||
            (entry.members.includes(current.currentUserId) && entry.crowdfund_manager_ids.includes(current.currentUserId))
        );
        if (!startup) {
          return current;
        }
        return {
          ...current,
          funding_campaigns: [
            {
              id: id("campaign"),
              startup_id: startup.id,
              current_amount: 0,
              status: "active",
              stripe_connect_account_id: "acct_demo_founder",
              ...payload
            },
            ...current.funding_campaigns
          ]
        };
      });
    },
    deleteCampaign(campaignId) {
      setState((current) => ({
        ...current,
        funding_campaigns: current.funding_campaigns.filter((campaign) => campaign.id !== campaignId),
        contributions: current.contributions.filter((contribution) => contribution.campaign_id !== campaignId)
      }));
    },
    backCampaign(payload) {
      setState((current) => {
        const campaign = current.funding_campaigns.find((entry) => entry.id === payload.campaignId);
        if (!campaign) return current;
        const startup = current.startups.find((entry) => entry.id === campaign.startup_id);
        if (startup?.founder_id === current.currentUserId) return current;

        const nextAmount = campaign.current_amount + payload.amount;
        const nextStatus = nextAmount >= campaign.target_amount ? "completed" : campaign.status;

        const contribution: Contribution = {
          id: id("contrib"),
          campaign_id: payload.campaignId,
          user_id: current.currentUserId,
          amount: payload.amount,
          payment_intent_id: `pi_${id("demo")}`
        };

        return {
          ...current,
          funding_campaigns: current.funding_campaigns.map((entry) =>
            entry.id === payload.campaignId
              ? { ...entry, current_amount: nextAmount, status: nextStatus }
              : entry
          ),
          contributions: [contribution, ...current.contributions]
        };
      });
    },
    freezeCampaign(campaignId) {
      setState((current) => ({
        ...current,
        funding_campaigns: current.funding_campaigns.map((campaign) =>
          campaign.id === campaignId ? { ...campaign, status: "frozen" } : campaign
        )
      }));
    }
  };

  useEffect(() => {
    if (!ready) return;
    setState((current) => {
      if (current.profiles.some((profile) => profile.id === ADMIN_UID)) return current;
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
            bannerUrl: DEFAULT_BANNER,
            education: [
              {
                id: "edu-admin-1",
                school: "Internal",
                detail: "Operations Training",
                logoUrl: "https://logo.clearbit.com/openai.com"
              }
            ],
            experience: [
              {
                id: "exp-admin-1",
                company: "Trust Office",
                role: "Administrator",
                summary: "Trust and safety oversight.",
                logoUrl: "https://logo.clearbit.com/openai.com"
              }
            ],
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
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}
