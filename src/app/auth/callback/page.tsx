"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error || !data.session) {
        router.replace("/login")
        return
      }

      const user = data.session.user

      // ✅ SAVE / UPSERT USER
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          name: user.user_metadata?.full_name,
        }),
      })

      router.replace("/")
    }

    handleAuth()
  }, [router])

  return <p>Signing you in...</p>
}
