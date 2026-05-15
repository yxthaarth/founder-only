"use client";

import { LogOut, PencilLine, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, Input, Label, Modal, Textarea } from "@/components/ui";
import { EducationEntry, ExperienceEntry } from "@/lib/types";
import { useStore } from "@/lib/store";

function EditableTextList({
  label,
  values,
  onChange,
  placeholder
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");

  return (
    <div className="space-y-3 md:col-span-2">
      <Label>{label}</Label>
      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={`${value}-${index}`} className="flex items-center gap-2">
            <div className="flex-1 rounded-xl border border-line bg-zinc-950 px-3 py-2 text-sm text-zinc-300">
              {value}
            </div>
            <button
              onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))}
              className="rounded-lg border border-line p-2 text-zinc-500 transition hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={placeholder} />
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            if (!draft.trim()) return;
            onChange([...values, draft.trim()]);
            setDraft("");
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add
        </Button>
      </div>
    </div>
  );
}

function EditableEducationList({
  values,
  onChange
}: {
  values: EducationEntry[];
  onChange: (values: EducationEntry[]) => void;
}) {
  const [school, setSchool] = useState("");
  const [detail, setDetail] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  return (
    <div className="space-y-3 md:col-span-2">
      <Label>Education</Label>
      <div className="space-y-2">
        {values.map((value) => (
          <div key={value.id} className="flex items-center gap-2 rounded-xl border border-line bg-zinc-950 px-3 py-3">
            <img src={value.logoUrl} alt={value.school} className="h-10 w-10 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="text-sm text-white">{value.school}</p>
              <p className="text-sm text-zinc-500">{value.detail}</p>
            </div>
            <button
              onClick={() => onChange(values.filter((item) => item.id !== value.id))}
              className="rounded-lg border border-line p-2 text-zinc-500 transition hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        <Input value={school} onChange={(event) => setSchool(event.target.value)} placeholder="School" />
        <Input value={detail} onChange={(event) => setDetail(event.target.value)} placeholder="Degree / detail" />
        <Input value={logoUrl} onChange={(event) => setLogoUrl(event.target.value)} placeholder="Logo URL" />
      </div>
      <div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            if (!school.trim() || !detail.trim() || !logoUrl.trim()) return;
            onChange([
              ...values,
              {
                id: `edu-${Math.random().toString(36).slice(2, 8)}`,
                school: school.trim(),
                detail: detail.trim(),
                logoUrl: logoUrl.trim()
              }
            ]);
            setSchool("");
            setDetail("");
            setLogoUrl("");
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Education
        </Button>
      </div>
    </div>
  );
}

function EditableExperienceList({
  values,
  onChange
}: {
  values: ExperienceEntry[];
  onChange: (values: ExperienceEntry[]) => void;
}) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [summary, setSummary] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  return (
    <div className="space-y-3 md:col-span-2">
      <Label>Experience</Label>
      <div className="space-y-2">
        {values.map((value) => (
          <div key={value.id} className="flex items-start gap-2 rounded-xl border border-line bg-zinc-950 px-3 py-3">
            <img src={value.logoUrl} alt={value.company} className="mt-0.5 h-10 w-10 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="text-sm text-white">{value.role}</p>
              <p className="mt-1 text-sm text-zinc-400">{value.company}</p>
              <p className="mt-1 text-sm text-zinc-500">{value.summary}</p>
            </div>
            <button
              onClick={() => onChange(values.filter((item) => item.id !== value.id))}
              className="rounded-lg border border-line p-2 text-zinc-500 transition hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <Input value={company} onChange={(event) => setCompany(event.target.value)} placeholder="Company" />
        <Input value={role} onChange={(event) => setRole(event.target.value)} placeholder="Role" />
        <Input value={logoUrl} onChange={(event) => setLogoUrl(event.target.value)} placeholder="Company logo URL" />
        <Input value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Summary" />
      </div>
      <div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            if (!company.trim() || !role.trim() || !summary.trim() || !logoUrl.trim()) return;
            onChange([
              ...values,
              {
                id: `exp-${Math.random().toString(36).slice(2, 8)}`,
                company: company.trim(),
                role: role.trim(),
                summary: summary.trim(),
                logoUrl: logoUrl.trim()
              }
            ]);
            setCompany("");
            setRole("");
            setSummary("");
            setLogoUrl("");
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      </div>
    </div>
  );
}

export function Topbar({ title }: { title: string }) {
  const { state, currentUser, updateProfile, logout } = useStore();
  const [open, setOpen] = useState(false);
  const [bio, setBio] = useState(currentUser.bio);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl);
  const [bannerUrl, setBannerUrl] = useState(currentUser.bannerUrl);
  const [education, setEducation] = useState<EducationEntry[]>(currentUser.education);
  const [experience, setExperience] = useState<ExperienceEntry[]>(currentUser.experience);
  const [skills, setSkills] = useState<string[]>(currentUser.skills);

  useEffect(() => {
    setBio(currentUser.bio);
    setAvatarUrl(currentUser.avatarUrl);
    setBannerUrl(currentUser.bannerUrl);
    setEducation(currentUser.education);
    setExperience(currentUser.experience);
    setSkills(currentUser.skills);
  }, [currentUser]);

  const unread = state.notifications.filter((item) => item.userId === currentUser.id && !item.read).length;

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-medium text-white">{title}</h1>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {unread > 0 ? (
            <div className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-sm text-zinc-400">
              {unread} notifications
            </div>
          ) : null}
          <Button variant="secondary" onClick={() => setOpen(true)}>
            <PencilLine className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
          <Button variant="ghost" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      <Modal open={open} title="Edit Profile" onClose={() => setOpen(false)}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Profile Image URL</Label>
            <Input value={avatarUrl} onChange={(event) => setAvatarUrl(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Banner URL</Label>
            <Input value={bannerUrl} onChange={(event) => setBannerUrl(event.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Bio</Label>
            <Textarea rows={4} value={bio} onChange={(event) => setBio(event.target.value)} />
          </div>
          <EditableEducationList values={education} onChange={setEducation} />
          <EditableExperienceList values={experience} onChange={setExperience} />
          <EditableTextList label="Skills" values={skills} onChange={setSkills} placeholder="Add a skill" />
          <div className="flex justify-end md:col-span-2">
            <Button
              onClick={() => {
                updateProfile({
                  avatarUrl,
                  bannerUrl,
                  bio,
                  education,
                  experience,
                  skills
                });
                setOpen(false);
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
