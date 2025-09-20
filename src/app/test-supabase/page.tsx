'use client'

import { useSupabaseAuth } from '@/components/auth/SupabaseAuthProvider'
import { Button } from '@/components/atoms/Button'
import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'

export default function TestSupabasePage() {
  const {
    isAuthenticated,
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile
  } = useSupabaseAuth()

  const handleTestSignUp = async () => {
    try {
      await signUp('test@example.com', 'password123', { full_name: 'Test User' })
      alert('Sign up successful! Check your email for confirmation.')
    } catch (error) {
      alert('Sign up failed: ' + (error as Error).message)
    }
  }

  const handleTestSignIn = async () => {
    try {
      await signIn('test@example.com', 'password123')
      alert('Sign in successful!')
    } catch (error) {
      alert('Sign in failed: ' + (error as Error).message)
    }
  }

  const handleTestUpdateProfile = async () => {
    if (!isAuthenticated) {
      alert('Please sign in first')
      return
    }

    try {
      await updateProfile({
        full_name: 'Updated Test User',
        website: 'https://example.com'
      })
      alert('Profile updated successfully!')
    } catch (error) {
      alert('Profile update failed: ' + (error as Error).message)
    }
  }

  const handleTestResetPassword = async () => {
    try {
      await resetPassword('test@example.com')
      alert('Password reset email sent!')
    } catch (error) {
      alert('Password reset failed: ' + (error as Error).message)
    }
  }

  return (
    <div className="container-theme py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Typography variant="h1" weight="bold" className="text-center">
          Supabase Authentication Test
        </Typography>

        <Card className="p-6">
          <Typography variant="h3" weight="bold" className="mb-4">
            Authentication Status
          </Typography>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <Typography variant="body" weight="bold">Status:</Typography>
              <span className={`px-2 py-1 rounded text-sm ${
                isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Typography variant="body" weight="bold">Loading:</Typography>
              <span className={`px-2 py-1 rounded text-sm ${
                loading ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {loading ? 'Yes' : 'No'}
              </span>
            </div>

            {user && (
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <Typography variant="body" weight="bold" className="mb-2">User Info:</Typography>
                <div className="space-y-1 text-sm">
                  <div><strong>ID:</strong> {user.id}</div>
                  <div><strong>Email:</strong> {user.email}</div>
                  <div><strong>Name:</strong> {user.name || 'Not set'}</div>
                  <div><strong>Full Name:</strong> {user.full_name || 'Not set'}</div>
                  <div><strong>Avatar:</strong> {user.avatar_url || 'Not set'}</div>
                  <div><strong>Website:</strong> {user.website || 'Not set'}</div>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                <Typography variant="body" weight="bold" color="error" className="mb-2">
                  Error:
                </Typography>
                <Typography variant="caption" color="error">
                  {error.message}
                </Typography>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <Typography variant="h3" weight="bold" className="mb-4">
            Test Actions
          </Typography>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {!isAuthenticated ? (
              <>
                <Button onClick={handleTestSignUp} variant="outline">
                  Test Sign Up
                </Button>
                <Button onClick={handleTestSignIn} variant="outline">
                  Test Sign In
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleTestUpdateProfile} variant="outline">
                  Update Profile
                </Button>
                <Button onClick={handleTestResetPassword} variant="outline">
                  Reset Password
                </Button>
                <Button onClick={signOut} variant="outline" className="sm:col-span-2">
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <Typography variant="h3" weight="bold" className="mb-4">
            Setup Instructions
          </Typography>

          <div className="space-y-4 text-sm">
            <div>
              <Typography variant="body" weight="bold" className="mb-2">
                1. Create a Supabase Project:
              </Typography>
              <Typography variant="caption" color="secondary">
                Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">supabase.com</a> and create a new project
              </Typography>
            </div>

            <div>
              <Typography variant="body" weight="bold" className="mb-2">
                2. Update Environment Variables:
              </Typography>
              <Typography variant="caption" color="secondary">
                Copy your project URL and anon key to the `.env` file
              </Typography>
            </div>

            <div>
              <Typography variant="body" weight="bold" className="mb-2">
                3. Run Database Schema:
              </Typography>
              <Typography variant="caption" color="secondary">
                Execute the `supabase-schema.sql` file in your Supabase SQL Editor
              </Typography>
            </div>

            <div>
              <Typography variant="body" weight="bold" className="mb-2">
                4. Configure Authentication:
              </Typography>
              <Typography variant="caption" color="secondary">
                Set your site URL to `http://localhost:3000` in Supabase Auth settings
              </Typography>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}