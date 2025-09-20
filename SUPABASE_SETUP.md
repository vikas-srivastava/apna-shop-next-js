# Supabase Setup Guide

This guide will help you set up Supabase authentication for your Next.js eCommerce application.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. A new Supabase project

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in your project details:
   - **Name**: Your project name (e.g., "ecommerce-app")
   - **Database Password**: Choose a strong password
   - **Region**: Select the region closest to your users
4. Click "Create new project"

## Step 2: Get Your Project Credentials

1. Once your project is created, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon/public key**: Your anonymous/public API key
   - **service_role key**: Your service role key (keep this secret!)

## Step 3: Configure Environment Variables

Update your `.env` file with the Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `supabase-schema.sql`
3. Paste it into the SQL Editor
4. Click **Run** to execute the schema

This will create all necessary tables, policies, and triggers for your eCommerce application.

## Step 5: Configure Authentication

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add `http://localhost:3000/auth/callback`
3. Under **Auth Providers**, you can enable additional providers like Google, GitHub, etc.

## Step 6: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/login` in your browser
3. Try registering a new account
4. Try logging in with the new account
5. Check the Supabase dashboard under **Authentication** → **Users** to see the new user

## Database Tables Created

The schema creates the following tables:

- **`profiles`**: Extended user profile information
- **`user_preferences`**: User settings and preferences
- **`addresses`**: Shipping and billing addresses
- **`wishlist`**: User's saved products
- **`cart_items`**: Shopping cart items (persistent)
- **`orders`**: Order history and details
- **`order_items`**: Individual items within orders
- **`reviews`**: Product reviews and ratings
- **`newsletter_subscriptions`**: Email subscription management
- **`search_history`**: User search tracking
- **`product_views`**: Product view analytics

## Security Features

- **Row Level Security (RLS)**: Enabled on all tables
- **Policies**: Users can only access their own data
- **Automatic Profile Creation**: Profiles are created automatically when users sign up
- **Secure Authentication**: Uses Supabase's built-in authentication system

## Next Steps

1. **Customize Authentication UI**: Modify the `AuthButton` component to match your design
2. **Add Social Login**: Enable Google, GitHub, or other OAuth providers in Supabase
3. **Email Templates**: Customize the email templates for password reset, etc.
4. **User Management**: Add user management features in your admin panel

## Troubleshooting

### Common Issues:

1. **"Invalid API key" error**:
   - Double-check your `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env`
   - Make sure you're using the `anon` key, not the `service_role` key

2. **"Table doesn't exist" error**:
   - Make sure you've run the SQL schema in the Supabase SQL Editor
   - Check that all tables were created successfully

3. **Authentication not working**:
   - Verify your Site URL and Redirect URLs in Supabase Auth settings
   - Check that your domain is allowed in the redirect URLs

4. **CORS errors**:
   - Supabase handles CORS automatically, but make sure your Site URL is correct

### Debug Mode

You can enable debug logging by adding to your `.env`:

```env
NEXT_PUBLIC_SUPABASE_DEBUG=true
```

## Production Deployment

When deploying to production:

1. Update the **Site URL** in Supabase to your production domain
2. Add your production domain to the **Redirect URLs**
3. Update the `NEXT_PUBLIC_SUPABASE_URL` in your production environment
4. Make sure to keep the `SUPABASE_SERVICE_ROLE_KEY` secure and not expose it to the client

## Support

For more information, check the [Supabase Documentation](https://supabase.com/docs) or join the [Supabase Discord](https://supabase.com/discord).