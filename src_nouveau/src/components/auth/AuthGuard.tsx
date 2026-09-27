"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import type { UserRole } from "@/lib/auth";
import { ROLE_HOME } from "@/lib/auth";

export function AuthGuard({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles: UserRole[];
}) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);

  useEffect(() => {
    const finish = () => useAuthStore.getState().setHydrated(true);
    finish();
    const unsub = useAuthStore.persist.onFinishHydration(finish);
    return unsub;
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      router.replace("/auth");
      return;
    }
    if (!roles.includes(user.role) && user.role !== "admin") {
      router.replace(ROLE_HOME[user.role]);
    }
  }, [hydrated, user, roles, router]);

  if (!hydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted">
        Chargement…
      </div>
    );
  }

  if (!user || (!roles.includes(user.role) && user.role !== "admin")) {
    return null;
  }

  return <>{children}</>;
}
