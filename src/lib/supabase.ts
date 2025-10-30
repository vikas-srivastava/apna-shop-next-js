import { createClient } from '@supabase/supabase-js'

// Client-side only Supabase client creation
let supabaseClient: ReturnType<typeof createClient> | null = null

// Mock Supabase client for development/testing when NEXT_PUBLIC_USE_MOCK is true
const createMockSupabaseClient = () => {
  console.warn('Using MOCK Supabase client. No real database operations will be performed.')

  const mockAuth = {
    signInWithPassword: async ({ email, password }: any) => {
      console.log('MOCK: signInWithPassword', { email, password })
      if (email === 'test@example.com' && password === 'password') {
        return { data: { session: { access_token: 'mock_access_token', user: { id: 'mock_user_id', email } } }, error: null }
      }
      return { data: { session: null }, error: { message: 'Invalid mock credentials' } }
    },
    signUp: async ({ email, password }: any) => {
      console.log('MOCK: signUp', { email, password })
      if (email && password) {
        return { data: { session: { access_token: 'mock_access_token', user: { id: 'mock_user_id', email } } }, error: null }
      }
      return { data: { session: null }, error: { message: 'Mock signup failed' } }
    },
    signOut: async () => {
      console.log('MOCK: signOut')
      return { error: null }
    },
    resetPasswordForEmail: async (email: string, options: any) => {
      console.log('MOCK: resetPasswordForEmail', { email, options })
      return { data: null, error: null }
    },
    updateUser: async (updates: any) => {
      console.log('MOCK: updateUser', updates)
      return { data: { user: { id: 'mock_user_id', ...updates } }, error: null }
    },
    getSession: async () => {
      console.log('MOCK: getSession')
      // Simulate a logged-in session if needed for testing
      return { data: { session: { access_token: 'mock_access_token', user: { id: 'mock_user_id', email: 'test@example.com' } } }, error: null }
    },
    onAuthStateChange: (callback: any) => {
      console.log('MOCK: onAuthStateChange')
      // Immediately call callback with a mock session for testing purposes
      // In a real scenario, this would be triggered by auth events
      // callback('SIGNED_IN', { access_token: 'mock_access_token', user: { id: 'mock_user_id', email: 'test@example.com' } });
      return { data: { subscription: { unsubscribe: () => console.log('MOCK: unsubscribe') } } }
    },
    setSession: async (session: any) => {
      console.log('MOCK: setSession', session)
      return { data: { session }, error: null }
    }
  }

  return {
    auth: mockAuth,
    // Add other mock client properties/methods if needed by the application
    from: (tableName: string) => {
      console.log(`MOCK: Accessing table "${tableName}"`);
      return {
        select: async () => ({ data: [], error: null }),
        insert: async (data: any) => ({ data: data, error: null }),
        update: async (data: any) => ({ data: data, error: null }),
        delete: async () => ({ data: [], error: null }),
      }
    }
  } as unknown as ReturnType<typeof createClient>
}

export const getSupabaseClient = () => {
  if (typeof window === 'undefined') {
    throw new Error('Supabase client can only be used on the client side')
  }

  // Check for mock mode
  if (process.env.NEXT_PUBLIC_USE_MOCK === 'true') {
    if (!supabaseClient) {
      supabaseClient = createMockSupabaseClient()
    }
    return supabaseClient
  }

  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables')
    }

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  }

  return supabaseClient
}

// For backward compatibility, but will throw on server
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    const client = getSupabaseClient()
    return client[prop as keyof typeof client]
  }
})

// Database types for TypeScript
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          avatar_url: string | null
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}