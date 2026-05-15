"use client";

import { useState } from "react";
import { ADMIN_UID } from "@/lib/constants";
import { useStore } from "@/lib/store";
import { Button, Panel } from "@/components/ui";

export function AdminCenter() {
  const { state, currentUser, approveStartup, rejectStartup, freezeCampaign } = useStore();
  const [tab, setTab] = useState<"submissions" | "campaigns">("submissions");

  if (currentUser.id !== ADMIN_UID) {
    return (
      <Panel className="p-5">
        <p className="text-sm text-white">Access denied.</p>
      </Panel>
    );
  }

  const pending = state.startups.filter((startup) => startup.status === "pending");
  const campaigns = state.funding_campaigns;

  return (
    <Panel className="p-5">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-sm font-medium text-white">Admin Command Center</h2>
        <div className="flex gap-2">
          <Button variant={tab === "submissions" ? "secondary" : "ghost"} onClick={() => setTab("submissions")}>
            Submissions
          </Button>
          <Button variant={tab === "campaigns" ? "secondary" : "ghost"} onClick={() => setTab("campaigns")}>
            Campaigns
          </Button>
        </div>
      </div>
      {tab === "submissions" ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line text-zinc-500">
                <th className="py-3 pr-4 font-medium">Founder</th>
                <th className="py-3 pr-4 font-medium">Project</th>
                <th className="py-3 pr-4 font-medium">GitHub</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((startup) => {
                const founder = state.profiles.find((profile) => profile.id === startup.founder_id);
                return (
                  <tr key={startup.id} className="border-b border-line">
                    <td className="py-4 pr-4 text-white">{founder?.email}</td>
                    <td className="py-4 pr-4">
                      <div>
                        <p className="text-white">{startup.name}</p>
                        <p className="mt-1 text-zinc-500">{startup.pitch}</p>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-zinc-400">{startup.github_url}</td>
                    <td className="py-4 pr-4 font-mono text-zinc-400">{startup.status}</td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <Button variant="secondary" onClick={() => approveStartup(startup.id)}>
                          Approve
                        </Button>
                        <Button variant="ghost" onClick={() => rejectStartup(startup.id)}>
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line text-zinc-500">
                <th className="py-3 pr-4 font-medium">Startup</th>
                <th className="py-3 pr-4 font-medium">Target</th>
                <th className="py-3 pr-4 font-medium">Current</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => {
                const startup = state.startups.find((entry) => entry.id === campaign.startup_id);
                return (
                  <tr key={campaign.id} className="border-b border-line">
                    <td className="py-4 pr-4 text-white">{startup?.name}</td>
                    <td className="py-4 pr-4 font-mono text-zinc-400">${campaign.target_amount.toLocaleString()}</td>
                    <td className="py-4 pr-4 font-mono text-zinc-400">${campaign.current_amount.toLocaleString()}</td>
                    <td className="py-4 pr-4 font-mono text-zinc-400">{campaign.status}</td>
                    <td className="py-4">
                      <Button variant="ghost" onClick={() => freezeCampaign(campaign.id)}>
                        Freeze Campaign
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}
