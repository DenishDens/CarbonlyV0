"use server"

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { redirect } from "next/navigation"
import { RequestCookies } from "next/dist/server/web/spec-extension/cookies"
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function signInWithEmail(email: string, password: string, rememberMe = false) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  )

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return {
      success: true,
      message: 'Signed in successfully.',
    }
  } catch (error) {
    console.error('Error in signInWithEmail:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to sign in',
    }
  }
}

export async function signOut() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  )

  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error

    return {
      success: true,
      message: 'Signed out successfully.',
    }
  } catch (error) {
    console.error('Error in signOut:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to sign out',
    }
  }
}

export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string,
  organizationName?: string,
  invitationToken?: string
) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  )

  try {
    // Create the user account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (authError) throw authError
    if (!authData.user) throw new Error('Failed to create user account')

    // Check if email confirmation is required
    if (authData.session === null) {
      return {
        success: true,
        message: 'Please check your email to confirm your account.',
      }
    }

    // If there's an invitation token, accept it
    if (invitationToken) {
      const { data: invitation, error: invitationError } = await supabase
        .from('organization_invitations')
        .select('*')
        .eq('token', invitationToken)
        .single()

      if (invitationError) throw invitationError
      if (!invitation) throw new Error('Invalid invitation')

      // Add user to organization_members
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert([
          {
            organization_id: invitation.organization_id,
            user_id: authData.user.id,
            role: invitation.role,
          },
        ])

      if (memberError) throw memberError

      // Mark invitation as used
      const { error: updateError } = await supabase
        .from('organization_invitations')
        .update({ used_at: new Date().toISOString() })
        .eq('id', invitation.id)

      if (updateError) throw updateError

      // Update user's organization_id
      const { error: userError } = await supabase
        .from('user_profiles')
        .update({ organization_id: invitation.organization_id })
        .eq('id', authData.user.id)

      if (userError) throw userError

      return {
        success: true,
        message: 'Account created and invitation accepted successfully.',
      }
    }

    // If no invitation token but organization name is provided, create a new organization
    if (organizationName) {
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert([
          {
            name: organizationName,
            owner_id: authData.user.id,
          },
        ])
        .select()
        .single()

      if (orgError) throw orgError

      // Add user as owner to organization_members
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert([
          {
            organization_id: orgData.id,
            user_id: authData.user.id,
            role: 'owner',
          },
        ])

      if (memberError) throw memberError

      // Update user's organization_id
      const { error: userError } = await supabase
        .from('user_profiles')
        .update({ organization_id: orgData.id })
        .eq('id', authData.user.id)

      if (userError) throw userError

      return {
        success: true,
        message: 'Account and organization created successfully.',
      }
    }

    return {
      success: true,
      message: 'Account created successfully.',
    }
  } catch (error) {
    console.error('Error in signUpWithEmail:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create account',
    }
  }
}

