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
      setUser(data.session?.user || null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <nav className="w-full border-b bg-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LEFT — BRAND */}
        <Link
          href="/"
          className="text-xl font-bold cursor-pointer"
        >
          Trust Property
        </Link>



        {/* RIGHT — ACTIONS */}
        <div className="flex items-center gap-4">
          {user && (
            <button
              onClick={() => router.push("/add-property")}
              className="px-4 py-2 border rounded text-sm"
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
                supabase.auth.signInWithOAuth({ provider: "google" })
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
