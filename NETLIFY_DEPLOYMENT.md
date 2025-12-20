# Netlify Deployment Guide

This guide will help you deploy your Bexy Flowers project to Netlify.

## Prerequisites

1. A Netlify account (sign up at [netlify.com](https://www.netlify.com))
2. Your GitHub repository connected to Netlify
3. Your Supabase credentials

## Deployment Steps

### 1. Connect Your Repository to Netlify

1. Log in to [Netlify Dashboard](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose your Git provider (GitHub) and select your `bexy-flowers` repository
4. Netlify will automatically detect the build settings from `netlify.toml`

### 2. Configure Environment Variables

Go to **Site settings** → **Environment variables** and add:

- **Variable name:** `VITE_SUPABASE_URL`
  - **Value:** Your Supabase project URL (e.g., `https://xxxxxxxxxxxxx.supabase.co`)

- **Variable name:** `VITE_SUPABASE_ANON_KEY`
  - **Value:** Your Supabase anonymous/public key

> **Note:** You can find these values in your Supabase dashboard under **Settings** → **API**

### 3. Deploy

1. Netlify will automatically start building and deploying your site
2. The build command (`npm run build`) and publish directory (`dist`) are already configured in `netlify.toml
3. Once the build completes, your site will be live!

### 4. Custom Domain (Optional)

1. Go to **Domain settings** in your Netlify dashboard
2. Click "Add custom domain"
3. Follow the instructions to configure your domain

## Build Configuration

The following settings are configured in `netlify.toml`:

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** Uses Netlify's default (Node 18+)

## Redirects

The `_redirects` file ensures that all routes are handled by your React Router SPA. This means:
- Direct navigation to routes like `/collection`, `/customize`, etc. will work correctly
- 404 errors won't occur when refreshing pages on client-side routes

## Security Headers

The following security headers are automatically applied:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

## Caching

Static assets (images, CSS, JS) are cached for 1 year for optimal performance.

## Troubleshooting

### Build Fails

1. Check the build logs in Netlify dashboard
2. Ensure all environment variables are set correctly
3. Verify that `node_modules` are installed (Netlify does this automatically)

### Routes Return 404

- Ensure the `_redirects` file is in the `public` folder (it should be copied to `dist` during build)
- Check that the redirect rule in `netlify.toml` is correct

### Environment Variables Not Working

- Make sure variable names start with `VITE_` (required for Vite)
- Redeploy the site after adding/changing environment variables
- Check that values don't have extra spaces or quotes

## Support

For more information, visit:
- [Netlify Documentation](https://docs.netlify.com)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#netlify)

