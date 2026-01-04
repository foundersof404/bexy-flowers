# 🔍 Wedding Creations Debug Guide

## Issue: "No wedding creation photos available at the moment."

## 🔍 Step-by-Step Diagnosis

### Step 1: Check Database Proxy Deployment
The wedding creations API was migrated to use the database proxy. **This requires deployment to Netlify.**

**Check if deployed:**
1. Go to Netlify Dashboard → Your site → Deploys
2. Check if latest deploy includes database proxy changes
3. If not deployed: **Deploy immediately**

### Step 2: Test Database API Directly

Run this in browser console on your deployed site:

```javascript
// Test database proxy
async function testDB() {
  const response = await fetch('/.netlify/functions/database', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': 'your-frontend-api-key' // Replace with actual key
    },
    body: JSON.stringify({
      operation: 'select',
      table: 'wedding_creations',
      filters: { is_active: true }
    })
  });
  const result = await response.json();
  console.log('Status:', response.status);
  console.log('Result:', result);
}
testDB();
```

**Expected result:** Status 200, result.data contains wedding creation objects

### Step 3: Check Database Content

If database proxy works but returns empty array:

**Add sample wedding creation data:**

```sql
INSERT INTO wedding_creations (
  title,
  description,
  image_url,
  is_active,
  display_order,
  created_at,
  updated_at
) VALUES (
  'Elegant Wedding Bouquet',
  'Beautiful wedding flowers arrangement',
  '/assets/wedding-events/sample-wedding.jpg', -- Replace with actual image path
  true,
  1,
  NOW(),
  NOW()
);
```

### Step 4: Check Frontend Logs

In wedding page, check browser console for:
- "Loaded wedding creations: X [...]" (should show number > 0)
- "Final wedding image URLs: X [...]" (should show image URLs)

### Step 5: Verify Environment Variables

Ensure these are set in Netlify:
- `FRONTEND_API_KEY` (same value as `VITE_FRONTEND_API_KEY`)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## 🚀 Quick Fix

If database proxy is deployed and working:

1. **Add sample data to wedding_creations table**
2. **Ensure is_active = true**
3. **Clear browser cache**
4. **Test wedding page**

## 📋 Complete Checklist

- [ ] Database proxy deployed to Netlify
- [ ] wedding_creations table exists
- [ ] Table has records with is_active = true
- [ ] Records have valid image_url values
- [ ] Environment variables set correctly
- [ ] Browser cache cleared

## 🎯 Most Likely Solution

**99% chance: Database proxy changes not deployed yet.**

**Fix:** Deploy to Netlify immediately, then check if wedding photos appear.

If still not working after deployment, check database content.
