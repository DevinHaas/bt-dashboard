"use client";
import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export function Header() {
  const url = usePathname();
  const { isSignedIn } = useAuth();
  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Devin&apos;s Bachelor Thesis
        </Link>
        <div className="flex gap-2">
          {isSignedIn && !url.includes("dashboard") && (
            <Link href="/dashboard/daily">
              <Button>Daily Dashboard</Button>
            </Link>
          )}

          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}
