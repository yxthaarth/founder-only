import { ADMIN_UID, DEFAULT_AVATAR } from "@/lib/constants";
import { AppState } from "@/lib/types";

export const seedState: AppState = {
  currentUserId: "user-001",
  profiles: [
    {
      id: "user-001",
      email: "builder@xlr8ter.dev",
      name: "Avery Stone",
      bio: "",
      avatarUrl: DEFAULT_AVATAR,
      role: "user",
      onboarding_status: "partial",
      is_verified: false,
      skills: []
    },
    {
      id: "founder-001",
      email: "founder@xlr8ter.dev",
      name: "Iris Vale",
      bio: "Founder building infra for product teams that ship in small, repeatable cycles.",
      avatarUrl: DEFAULT_AVATAR,
      role: "founder",
      onboarding_status: "complete",
      is_verified: true,
      skills: ["Product", "Operations"]
    },
    {
      id: ADMIN_UID,
      email: "admin@xlr8ter.dev",
      name: "System Admin",
      bio: "Admin access for queue review.",
      avatarUrl: DEFAULT_AVATAR,
      role: "admin",
      onboarding_status: "complete",
      is_verified: true,
      skills: ["Operations"]
    }
  ],
  startups: [
    {
      id: "startup-001",
      founder_id: "founder-001",
      name: "Relayframe",
      pitch: "Operational tooling for teams that need structured shipping rituals.",
      github_url: "https://github.com/relayframe/product-core",
      demo_url: "https://relayframe.dev",
      status: "verified",
      members: ["founder-001", "user-001"],
      milestones: [
        { label: "MVP", progress: 100 },
        { label: "Pilot", progress: 70 },
        { label: "Revenue", progress: 32 }
      ],
      openings: [
        { id: "opening-1", title: "Frontend Engineer", detail: "Own the dashboard shell and interaction system." }
      ]
    }
  ],
  connections: [
    {
      id: "conn-1",
      sender_id: "user-001",
      receiver_id: "founder-001",
      status: "accepted"
    }
  ],
  notifications: [],
  lobbyMessages: [
    {
      id: "msg-1",
      userId: "founder-001",
      body: "Looking for builders who can tighten developer workflows and reduce release friction.",
      createdAt: "2026-05-15T10:00:00.000Z"
    },
    {
      id: "msg-2",
      userId: "admin-uid-001",
      body: "Keep lobby posts specific. State the project, current traction, and what you need.",
      createdAt: "2026-05-15T10:03:00.000Z"
    }
  ],
  onboardingDrafts: {
    "user-001": {
      path: null,
      step: 1,
      founder: {
        name: "",
        vision: "",
        github_url: "",
        demo_url: ""
      },
      builder: {
        bio: "",
        skills: []
      }
    }
  }
};
