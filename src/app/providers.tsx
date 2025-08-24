"use client";

import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { authClient } from "@/auth/client";

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <AuthUIProvider
      authClient={authClient}
      navigate={router.push}
      replace={router.replace}
      social={{
        providers: ["google"],
      }}
      onSessionChange={() => {
        // Clear router cache (protected routes)
        router.refresh();
      }}
      credentials={false}
      Link={Link}
    >
      {children}
    </AuthUIProvider>
  );
}
