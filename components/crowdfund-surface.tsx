"use client";

import { useMemo, useState } from "react";
import { Button, Input, Label, Panel, Textarea } from "@/components/ui";
import { useStore } from "@/lib/store";

function Currency({ value }: { value: number }) {
  return <span className="font-mono">${value.toLocaleString()}</span>;
}

export function CrowdfundSurface({ mode }: { mode: "browse" | "manage" }) {
  const { state, currentUser, createCampaign, deleteCampaign, backCampaign } = useStore();
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [milestone, setMilestone] = useState("");
  const [reason, setReason] = useState("");
  const [backAmounts, setBackAmounts] = useState<Record<string, string>>({});
  const [confirmDeleteCampaignId, setConfirmDeleteCampaignId] = useState<string | null>(null);

  const campaigns = useMemo(
    () =>
      state.funding_campaigns.map((campaign) => {
        const startup = state.startups.find((entry) => entry.id === campaign.startup_id);
        const founder = startup ? state.profiles.find((profile) => profile.id === startup.founder_id) : undefined;
        return { campaign, startup, founder };
      }),
    [state.funding_campaigns, state.profiles, state.startups]
  );

  const managedCrowdfundStartup = state.startups.find(
    (startup) =>
      startup.founder_id === currentUser.id ||
      (startup.members.includes(currentUser.id) && startup.crowdfund_manager_ids.includes(currentUser.id))
  );
  const canManageCrowdfund = Boolean(managedCrowdfundStartup && currentUser.is_verified);

  if (mode === "manage") {
    if (!canManageCrowdfund || !managedCrowdfundStartup) {
      return (
        <Panel className="p-6">
          <h2 className="text-sm font-medium text-white">Manage Crowdfund</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-500">
            Only a verified founder or an approved company operator can create funding posts for their startup.
          </p>
        </Panel>
      );
    }

    const founderCampaigns = campaigns.filter(({ startup }) => startup?.id === managedCrowdfundStartup.id);

    return (
      <div className="space-y-4">
        <Panel className="p-6">
          <div className="mb-5">
            <h2 className="text-sm font-medium text-white">Manage Crowdfund</h2>
            <p className="mt-1 text-sm text-zinc-500">Publish funding requests for {managedCrowdfundStartup.name}.</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Target Amount</Label>
                <Input value={targetAmount} onChange={(event) => setTargetAmount(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Deadline</Label>
                <Input type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Project Milestone</Label>
                <Input value={milestone} onChange={(event) => setMilestone(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Why Funding Is Needed</Label>
                <Textarea rows={5} value={reason} onChange={(event) => setReason(event.target.value)} />
              </div>
              <Button
                onClick={() => {
                  if (!targetAmount || !deadline || !milestone || !reason) return;
                  createCampaign({
                    target_amount: Number(targetAmount),
                    deadline: new Date(deadline).toISOString(),
                    milestone,
                    reason
                  });
                  setTargetAmount("");
                  setDeadline("");
                  setMilestone("");
                  setReason("");
                }}
              >
                Publish Funding Post
              </Button>
            </div>
            <div className="rounded-2xl border border-line bg-zinc-950 p-5">
              <p className="text-sm text-white">Active Posts</p>
              <div className="mt-4 space-y-3">
                {founderCampaigns.map(({ campaign }) => (
                  <div key={campaign.id} className="rounded-2xl border border-line bg-surface px-4 py-4">
                    <p className="text-sm text-white">{campaign.milestone}</p>
                    <p className="mt-2 font-mono text-xs text-zinc-500">
                      <Currency value={campaign.current_amount} /> / <Currency value={campaign.target_amount} />
                    </p>
                    <div className="mt-4">
                      <Button
                        variant={confirmDeleteCampaignId === campaign.id ? "danger" : "ghost"}
                        onClick={() => {
                          if (confirmDeleteCampaignId === campaign.id) {
                            deleteCampaign(campaign.id);
                            setConfirmDeleteCampaignId(null);
                            return;
                          }
                          setConfirmDeleteCampaignId(campaign.id);
                        }}
                      >
                        {confirmDeleteCampaignId === campaign.id ? "Confirm Delete" : "Delete Campaign"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Panel>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {campaigns.map(({ campaign, startup, founder }) => {
        if (!startup || !founder) return null;
        const progress = Math.min(100, (campaign.current_amount / campaign.target_amount) * 100);
        const disabled = founder.id === currentUser.id || campaign.status !== "active";

        return (
          <Panel key={campaign.id} className="p-6">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{startup.name}</h3>
                    <p className="mt-2 text-sm text-zinc-500">{founder.name}</p>
                  </div>
                  <span className="font-mono text-xs text-zinc-500">{campaign.status}</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-zinc-300">{campaign.milestone}</p>
                <p className="mt-3 text-sm leading-6 text-zinc-500">{campaign.reason}</p>
                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <p className="font-mono text-zinc-300">
                      <Currency value={campaign.current_amount} /> / <Currency value={campaign.target_amount} />
                    </p>
                    <p className="font-mono text-zinc-500">{progress.toFixed(0)}%</p>
                  </div>
                  <div className="h-2 w-full bg-zinc-700">
                    <div className="h-full bg-white" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-line bg-zinc-950 p-4">
                <p className="text-sm font-medium text-white">Support</p>
                <p className="mt-3 text-sm text-zinc-500">Backing is sent to the founder through Stripe Connect.</p>
                <div className="mt-4 flex gap-3">
                  <Input
                    value={backAmounts[campaign.id] ?? ""}
                    onChange={(event) =>
                      setBackAmounts((current) => ({ ...current, [campaign.id]: event.target.value }))
                    }
                    placeholder="$ Amount"
                  />
                  <Button
                    disabled={disabled}
                    onClick={() =>
                      backCampaign({
                        campaignId: campaign.id,
                        amount: Number(backAmounts[campaign.id] ?? "0")
                      })
                    }
                  >
                    Back this Project
                  </Button>
                </div>
              </div>
            </div>
          </Panel>
        );
      })}
    </div>
  );
}
