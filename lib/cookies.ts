import { Profile } from "@/lib/types";

export function syncProfileCookies(profile: Profile) {
  document.cookie = `fo_uid=${profile.id}; path=/; max-age=31536000; samesite=lax`;
  document.cookie = `fo_role=${profile.role}; path=/; max-age=31536000; samesite=lax`;
  document.cookie = `fo_onboarding_status=${profile.onboarding_status}; path=/; max-age=31536000; samesite=lax`;
  document.cookie = `fo_verified=${profile.is_verified ? "1" : "0"}; path=/; max-age=31536000; samesite=lax`;
}
