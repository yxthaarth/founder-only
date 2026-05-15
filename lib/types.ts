export type ProfileRole = "user" | "founder" | "admin";
export type OnboardingStatus = "partial" | "complete";
export type StartupStatus = "pending" | "verified";
export type ConnectionStatus = "pending" | "accepted";
export type CampaignStatus = "active" | "completed" | "frozen";

export type EducationEntry = {
  id: string;
  school: string;
  detail: string;
  logoUrl: string;
};

export type ExperienceEntry = {
  id: string;
  company: string;
  role: string;
  summary: string;
  logoUrl: string;
};

export type Profile = {
  id: string;
  email: string;
  name: string;
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  role: ProfileRole;
  onboarding_status: OnboardingStatus;
  is_verified: boolean;
  skills: string[];
};

export type JobApplication = {
  id: string;
  openingId: string;
  userId: string;
  note: string;
  createdAt: string;
  status: "pending" | "accepted" | "rejected" | "follow_up";
};

export type DirectMessageThread = {
  id: string;
  participantIds: string[];
  applicationId?: string;
  startupId?: string;
  createdAt: string;
};

export type DirectMessage = {
  id: string;
  threadId: string;
  senderId: string;
  body: string;
  createdAt: string;
};

export type TeamRole = {
  userId: string;
  title: string;
};

export type Startup = {
  id: string;
  founder_id: string;
  name: string;
  pitch: string;
  imageUrl: string;
  github_url: string;
  demo_url: string;
  status: StartupStatus;
  members: string[];
  hiring_manager_ids: string[];
  crowdfund_manager_ids: string[];
  people_manager_ids: string[];
  update_manager_ids: string[];
  teamRoles: TeamRole[];
  openings: Array<{ id: string; title: string; detail: string }>;
};

export type FundingCampaign = {
  id: string;
  startup_id: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  status: CampaignStatus;
  milestone: string;
  reason: string;
  stripe_connect_account_id: string;
};

export type Contribution = {
  id: string;
  campaign_id: string;
  user_id: string;
  amount: number;
  payment_intent_id: string;
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
  likedBy: string[];
  replyToId?: string;
  repostOfId?: string;
};

export type CommunityGroup = {
  id: string;
  name: string;
  description: string;
  focus: string;
  memberIds: string[];
};

export type GroupMessage = {
  id: string;
  groupId: string;
  userId: string;
  body: string;
  createdAt: string;
};

export type StartupUpdatePost = {
  id: string;
  startupId: string;
  authorId: string;
  title: string;
  body: string;
  createdAt: string;
};

export type StartupUpdateComment = {
  id: string;
  postId: string;
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
  funding_campaigns: FundingCampaign[];
  contributions: Contribution[];
  jobApplications: JobApplication[];
  dmThreads: DirectMessageThread[];
  dmMessages: DirectMessage[];
  connections: Connection[];
  notifications: Notification[];
  lobbyMessages: LobbyMessage[];
  groups: CommunityGroup[];
  groupMessages: GroupMessage[];
  startupPosts: StartupUpdatePost[];
  startupComments: StartupUpdateComment[];
  onboardingDrafts: Record<string, OnboardingDraft>;
};
