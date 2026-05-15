import { ADMIN_UID, DEFAULT_AVATAR, DEFAULT_BANNER } from "@/lib/constants";
import { AppState } from "@/lib/types";

export const seedState: AppState = {
  currentUserId: "founder-001",
  profiles: [
    {
      id: "user-001",
      email: "builder@xlr8ter.dev",
      name: "Avery Stone",
      bio: "Product engineer focused on systems, hiring loops, and developer workflows.",
      avatarUrl: DEFAULT_AVATAR,
      bannerUrl: DEFAULT_BANNER,
      education: [
        {
          id: "edu-avery-1",
          school: "Georgia Tech",
          detail: "B.S. Computer Science",
          logoUrl: "https://logo.clearbit.com/gatech.edu"
        }
      ],
      experience: [
        {
          id: "exp-avery-1",
          company: "Linear",
          role: "Product Engineer",
          summary: "3 years in product engineering and growth systems.",
          logoUrl: "https://logo.clearbit.com/linear.app"
        }
      ],
      role: "user",
      onboarding_status: "complete",
      is_verified: false,
      skills: ["Frontend", "Product", "Growth"]
    },
    {
      id: "founder-001",
      email: "founder@xlr8ter.dev",
      name: "Iris Vale",
      bio: "Founder building infra for product teams that ship in small, repeatable cycles.",
      avatarUrl: DEFAULT_AVATAR,
      bannerUrl: DEFAULT_BANNER,
      education: [
        {
          id: "edu-iris-1",
          school: "Stanford",
          detail: "M.S. Management Science",
          logoUrl: "https://logo.clearbit.com/stanford.edu"
        }
      ],
      experience: [
        {
          id: "exp-iris-1",
          company: "Vercel",
          role: "Founder / Operator",
          summary: "2 exits across workflow tooling and developer platforms.",
          logoUrl: "https://logo.clearbit.com/vercel.com"
        }
      ],
      role: "founder",
      onboarding_status: "complete",
      is_verified: true,
      skills: ["Product", "Operations", "Backend"]
    },
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
      skills: ["Operations"]
    }
  ],
  startups: [
    {
      id: "startup-001",
      founder_id: "founder-001",
      name: "Relayframe",
      pitch: "Operational tooling for teams that need structured shipping rituals.",
      imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
      github_url: "https://github.com/relayframe/product-core",
      demo_url: "https://relayframe.dev",
      status: "verified",
      members: ["founder-001", "user-001"],
      hiring_manager_ids: ["founder-001", "user-001"],
      crowdfund_manager_ids: ["founder-001"],
      people_manager_ids: ["founder-001"],
      update_manager_ids: ["founder-001", "user-001"],
      teamRoles: [
        { userId: "founder-001", title: "Founder" },
        { userId: "user-001", title: "Product Engineer" }
      ],
      openings: [
        { id: "opening-1", title: "Frontend Engineer", detail: "Own the dashboard shell and interaction system." },
        { id: "opening-2", title: "Growth Operator", detail: "Design founder acquisition and retention loops." }
      ]
    },
    {
      id: "startup-002",
      founder_id: "user-002",
      name: "Atlas Note",
      pitch: "Private knowledge graphs for startup operators and finance teams.",
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      github_url: "https://github.com/atlas-note/core",
      demo_url: "https://atlasnote.dev",
      status: "pending",
      members: ["user-002"],
      hiring_manager_ids: ["user-002"],
      crowdfund_manager_ids: ["user-002"],
      people_manager_ids: ["user-002"],
      update_manager_ids: ["user-002"],
      teamRoles: [{ userId: "user-002", title: "Founder" }],
      openings: [
        { id: "opening-3", title: "Founding Designer", detail: "Own product identity and interface language." }
      ]
    }
  ],
  funding_campaigns: [
    {
      id: "campaign-001",
      startup_id: "startup-001",
      target_amount: 12000,
      current_amount: 5200,
      deadline: "2026-06-30T00:00:00.000Z",
      status: "active",
      milestone: "Need $12,000 for AWS credits and observability tooling.",
      reason: "Funding infrastructure costs for pilot customers and load testing.",
      stripe_connect_account_id: "acct_demo_relayframe"
    },
    {
      id: "campaign-002",
      startup_id: "startup-002",
      target_amount: 8000,
      current_amount: 1600,
      deadline: "2026-07-12T00:00:00.000Z",
      status: "active",
      milestone: "Need $8,000 for design research and secure document ingestion.",
      reason: "Funding prototype depth before enterprise pilot rollout.",
      stripe_connect_account_id: "acct_demo_atlas"
    }
  ],
  contributions: [
    {
      id: "contrib-001",
      campaign_id: "campaign-001",
      user_id: "user-001",
      amount: 500,
      payment_intent_id: "pi_demo_001"
    }
  ],
  jobApplications: [
    {
      id: "apply-001",
      openingId: "opening-1",
      userId: "user-001",
      note: "Interested in owning the shell and interaction layer.",
      createdAt: "2026-05-15T09:30:00.000Z",
      status: "follow_up"
    }
  ],
  dmThreads: [
    {
      id: "thread-001",
      participantIds: ["founder-001", "user-001"],
      applicationId: "apply-001",
      startupId: "startup-001",
      createdAt: "2026-05-15T09:40:00.000Z"
    }
  ],
  dmMessages: [
    {
      id: "dm-001",
      threadId: "thread-001",
      senderId: "founder-001",
      body: "Thanks for applying. Can you share links to recent frontend work?",
      createdAt: "2026-05-15T09:41:00.000Z"
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
      body: "Relayframe is hiring across frontend systems and growth operations.",
      createdAt: "2026-05-15T10:00:00.000Z",
      likedBy: ["user-001"]
    },
    {
      id: "msg-2",
      userId: ADMIN_UID,
      body: "Use the lobby for concise updates, recruiting asks, and milestone announcements.",
      createdAt: "2026-05-15T10:03:00.000Z",
      likedBy: []
    }
  ],
  groups: [
    {
      id: "group-001",
      name: "Frontend Systems",
      description: "Interface engineers focused on performance, design systems, and product polish.",
      focus: "UI Engineering",
      memberIds: ["user-001", "founder-001"]
    },
    {
      id: "group-002",
      name: "Founder Ops",
      description: "Operators sharing hiring loops, fundraising prep, and execution systems.",
      focus: "Founder Network",
      memberIds: ["founder-001"]
    },
    {
      id: "group-003",
      name: "Growth Room",
      description: "Builders working on acquisition, retention, and startup messaging.",
      focus: "Growth",
      memberIds: []
    }
  ],
  groupMessages: [
    {
      id: "group-msg-001",
      groupId: "group-001",
      userId: "founder-001",
      body: "Dropping notes on interface systems and hiring loops here.",
      createdAt: "2026-05-15T11:00:00.000Z"
    },
    {
      id: "group-msg-002",
      groupId: "group-002",
      userId: "founder-001",
      body: "Founder ops group is open for execution systems and fundraising prep.",
      createdAt: "2026-05-15T11:10:00.000Z"
    }
  ],
  startupPosts: [
    {
      id: "post-001",
      startupId: "startup-001",
      authorId: "founder-001",
      title: "Shipped dashboard foundations",
      body: "We shipped the first pass of the workspace shell and tightened the job application workflow this week.",
      createdAt: "2026-05-15T12:00:00.000Z"
    }
  ],
  startupComments: [
    {
      id: "comment-001",
      postId: "post-001",
      userId: "user-001",
      body: "The new hiring flow feels much cleaner. Would love a candidate scorecard next.",
      createdAt: "2026-05-15T12:20:00.000Z"
    }
  ],
  onboardingDrafts: {
    "founder-001": {
      path: "founder",
      step: 3,
      founder: {
        name: "Relayframe",
        vision: "Operational tooling for teams that need structured shipping rituals.",
        github_url: "https://github.com/relayframe/product-core",
        demo_url: "https://relayframe.dev"
      },
      builder: {
        bio: "",
        skills: []
      }
    }
  }
};
