export type ProfileRole = "user" | "founder" | "admin";
export type OnboardingStatus = "partial" | "complete";
export type StartupStatus = "pending" | "verified";
export type ConnectionStatus = "pending" | "accepted";

export type Profile = {
  id: string;
  email: string;
  name: string;
  bio: string;
  avatarUrl: string;
  role: ProfileRole;
  onboarding_status: OnboardingStatus;
  is_verified: boolean;
  skills: string[];
};

export type Startup = {
  id: string;
  founder_id: string;
  name: string;
  pitch: string;
  github_url: string;
  demo_url: string;
  status: StartupStatus;
  members: string[];
  milestones: Array<{ label: string; progress: number }>;
  openings: Array<{ id: string; title: string; detail: string }>;
};

export type Connection = {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: ConnectionStatus;
};

export type Notification = {
  id: string;
  type: "connection_request" | "submission_rejected";
  userId: string;
  actorId?: string;
  message: string;
  requestId?: string;
  read: boolean;
};

export type LobbyMessage = {
  id: string;
  userId: string;
  body: string;
  createdAt: string;
};

export type OnboardingDraft = {
  path: "founder" | "builder" | null;
  step: 1 | 2 | 3;
  founder: {
    name: string;
    vision: string;
    github_url: string;
    demo_url: string;
  };
  builder: {
    bio: string;
    skills: string[];
  };
};

export type AppState = {
  currentUserId: string;
  profiles: Profile[];
  startups: Startup[];
  connections: Connection[];
  notifications: Notification[];
  lobbyMessages: LobbyMessage[];
  onboardingDrafts: Record<string, OnboardingDraft>;
};
