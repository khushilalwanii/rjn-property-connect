"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";



export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user;
      setUser(user || null);

      if (user) {
        fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name,
          }),
        });
      }
    });


    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
          const user = session?.user;
          setUser(user || null);

          if (user) {
            await fetch("/api/users", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: user.id,
                email: user.email,
                name: user.user_metadata?.name,
              }),
            });
          }
        });


    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <nav
      className="
        w-full px-6 py-4
        bg-[var(--card-bg)]
        border-b border-[var(--card-border)]
      "
    >

      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LEFT — BRAND */}
        <Link
          href="/"
          className="text-xl font-bold text-[var(--text-primary)] cursor-pointer"
        >
          RJN Property Connect
        </Link>



        {/* RIGHT — ACTIONS */}
        <div className="flex items-center gap-4">
          {user && (
            <button
              onClick={() => router.push("/add-property")}
              className="
                px-4 py-2 rounded text-sm
                bg-[var(--accent)]
                text-white
              "

            >
              Add / Sell Property
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <img
                src={user.user_metadata?.avatar_url}
                alt="Profile"
                className="h-8 w-8 rounded-full"
              />
              <span className="text-sm font-medium">
                {user.user_metadata?.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() =>
                supabase.auth.signInWithOAuth({
                  provider: "google",
                  options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                  },
                })

              }
              className="px-4 py-2 bg-black text-white rounded text-sm"
            >
              Continue with Google
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
