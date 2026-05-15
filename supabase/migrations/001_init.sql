create type public.profile_role as enum ('user', 'founder', 'admin');
create type public.onboarding_status as enum ('partial', 'complete');
create type public.startup_status as enum ('pending', 'verified');
create type public.connection_status as enum ('pending', 'accepted');

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  name text,
  bio text,
  avatar_url text,
  banner_url text,
  education text[] not null default '{}',
  experience text[] not null default '{}',
  role public.profile_role not null default 'user',
  onboarding_status public.onboarding_status not null default 'partial',
  is_verified boolean not null default false,
  skills text[] not null default '{}'
);

create table if not exists public.startups (
  id uuid primary key default gen_random_uuid(),
  founder_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  pitch text not null,
  github_url text not null,
  demo_url text,
  status public.startup_status not null default 'pending',
  hiring_manager_ids uuid[] not null default '{}'
);

create table if not exists public.connections (
  sender_id uuid not null references public.profiles (id) on delete cascade,
  receiver_id uuid not null references public.profiles (id) on delete cascade,
  status public.connection_status not null default 'pending',
  primary key (sender_id, receiver_id)
);

create table if not exists public.funding_campaigns (
  id uuid primary key default gen_random_uuid(),
  startup_id uuid not null references public.startups (id) on delete cascade,
  target_amount bigint not null,
  current_amount bigint not null default 0,
  deadline timestamptz not null,
  status text not null default 'active',
  milestone text not null,
  reason text not null
);

create table if not exists public.contributions (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.funding_campaigns (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  amount bigint not null,
  payment_intent_id text not null
);
