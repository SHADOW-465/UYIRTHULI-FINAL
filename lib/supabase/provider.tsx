"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "./client"
import type { SupabaseClient, Session } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

type SupabaseContextType = {
  supabase: SupabaseClient
  session: Session | null
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export default function SupabaseProvider({
  children,
  session,
}: {
  children: React.ReactNode
  session: Session | null
}) {
  const [supabase] = useState(() => getSupabaseBrowserClient())
  const router = useRouter()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email)
      
      if (event === 'SIGNED_IN' && session) {
        // User just signed in, redirect to dashboard
        const redirectUrl = process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || '/dashboard'
        router.push(redirectUrl)
        router.refresh()
      } else if (event === 'SIGNED_OUT') {
        // User signed out, redirect to login
        router.push('/login')
        router.refresh()
      } else if (event === 'TOKEN_REFRESHED' && session) {
        // Token refreshed, just refresh the page
        router.refresh()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  return (
    <SupabaseContext.Provider value={{ supabase, session }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider")
  }
  return context
}
