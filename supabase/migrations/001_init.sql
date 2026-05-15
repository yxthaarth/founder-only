create type public.profile_role as enum ('user', 'founder', 'admin');
create type public.onboarding_status as enum ('partial', 'complete');
create type public.startup_status as enum ('pending', 'verified');
create type public.connection_status as enum ('pending', 'accepted');

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  role public.profile_role not null default 'user',
  onboarding_status public.onboarding_status not null default 'partial',
  is_verified boolean not null default false
);

create table if not exists public.startups (
  id uuid primary key default gen_random_uuid(),
  founder_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  pitch text not null,
  github_url text not null,
  status public.startup_status not null default 'pending'
);

create table if not exists public.connections (
  sender_id uuid not null references public.profiles (id) on delete cascade,
  receiver_id uuid not null references public.profiles (id) on delete cascade,
  status public.connection_status not null default 'pending',
  primary key (sender_id, receiver_id)
);
