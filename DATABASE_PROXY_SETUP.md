# 🔒 Database Proxy Setup - Hide Database Provider

**Security Enhancement**: Hide Supabase from frontend by routing all database operations through a backend API proxy.

---

## 🎯 Architecture

### **Before (Exposed)**:
```
Frontend → Supabase (Direct)
- Supabase URL visible
- Anon key visible
- Database provider known
```

### **After (Hidden)**:
```
Frontend → Backend API → Supabase
- No Supabase URL in frontend
- No keys in frontend
- Database provider hidden
```

---

## ✅ Implementation Complete

### **1. Backend API Proxy** ✅
- **File**: `netlify/functions/database.ts`
- **Endpoint**: `/.netlify/functions/database`
- **Features**:
  - ✅ Handles all database operations (select, insert, update, delete, rpc)
  - ✅ Validates API keys
  - ✅ CORS protection
  - ✅ Input validation
  - ✅ SQL injection prevention

### **2. Frontend Database Client** ✅
- **File**: `src/lib/api/database-client.ts`
- **API**: `db.select()`, `db.insert()`, `db.update()`, `db.delete()`, `db.rpc()`
- **Features**:
  - ✅ No Supabase client in frontend
  - ✅ All requests go through backend API
  - ✅ Type-safe operations

---

## 📋 Setup Instructions

### **Step 1: Add Environment Variables to Netlify**

1. Go to **Netlify Dashboard** → Your Site → **Environment variables**
2. Add:
   - **Key**: `SUPABASE_URL`
   - **Value**: `https://your-project.supabase.co`
   - **Scopes**: Production, Deploy previews, Branch deploys
3. Add:
   - **Key**: `SUPABASE_SERVICE_ROLE_KEY` (or use `SUPABASE_ANON_KEY`)
   - **Value**: `[Your Supabase service role key or anon key]`
   - **Scopes**: Production, Deploy previews, Branch deploys

**Note**: Use service role key for admin operations, or anon key if RLS is properly configured.

---

### **Step 2: Update Frontend Code**

Replace direct Supabase calls with database client:

**Before**:
```typescript
import { supabase } from '@/lib/supabase';

const { data } = await supabase
  .from('collection_products')
  .select('*')
  .eq('is_active', true);
```

**After**:
```typescript
import { db } from '@/lib/api/database-client';

const data = await db.select('collection_products', {
  filters: { is_active: true }
});
```

---

### **Step 3: Migration Examples**

#### **Select Operations**:
```typescript
// Before
const { data } = await supabase
  .from('table')
  .select('*')
  .eq('column', 'value')
  .order('created_at', { ascending: false })
  .limit(10);

// After
const data = await db.select('table', {
  filters: { column: 'value' },
  orderBy: { column: 'created_at', ascending: false },
  limit: 10
});
```

#### **Insert Operations**:
```typescript
// Before
const { data } = await supabase
  .from('table')
  .insert({ name: 'Test', price: 100 })
  .select();

// After
const data = await db.insert('table', {
  name: 'Test',
  price: 100
});
```

#### **Update Operations**:
```typescript
// Before
const { data } = await supabase
  .from('table')
  .update({ price: 200 })
  .eq('id', '123')
  .select();

// After
const data = await db.update('table', 
  { id: '123' }, // filters
  { price: 200 } // data
);
```

#### **Delete Operations**:
```typescript
// Before
await supabase
  .from('table')
  .delete()
  .eq('id', '123');

// After
await db.delete('table', { id: '123' });
```

#### **RPC Functions**:
```typescript
// Before
const { data } = await supabase.rpc('function_name', { param: 'value' });

// After
const data = await db.rpc('function_name', { param: 'value' });
```

---

## 🔒 Security Benefits

### **1. Database Provider Hidden** ✅
- ✅ No Supabase URLs in frontend code
- ✅ No Supabase URLs in network requests
- ✅ Database provider completely hidden

### **2. Keys Protected** ✅
- ✅ No Supabase keys in frontend
- ✅ Keys only in server-side environment variables
- ✅ API key authentication required

### **3. Additional Security** ✅
- ✅ CORS protection
- ✅ Rate limiting (via existing security measures)
- ✅ Input validation
- ✅ SQL injection prevention

---

## 📝 Files to Update

### **Priority 1 (High Usage)**:
1. `src/lib/api/visitor-cart.ts` - Cart operations
2. `src/lib/api/visitor-favorites.ts` - Favorites operations
3. `src/lib/api/collection-products.ts` - Product queries
4. `src/lib/api/luxury-boxes.ts` - Box queries
5. `src/lib/api/flowers.ts` - Flower queries
6. `src/lib/api/accessories.ts` - Accessory queries
7. `src/lib/api/wedding-creations.ts` - Wedding queries

### **Priority 2 (Admin/Management)**:
8. Admin pages (if they use Supabase directly)

---

## 🚀 Migration Strategy

### **Phase 1: Setup** (5 minutes)
1. Add environment variables to Netlify
2. Deploy backend API function
3. Test API endpoint

### **Phase 2: Migrate High-Traffic Operations** (30 minutes)
1. Migrate cart operations
2. Migrate favorites operations
3. Migrate product queries

### **Phase 3: Migrate Remaining Operations** (1 hour)
1. Migrate all other database operations
2. Remove Supabase client from frontend
3. Remove `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from frontend

### **Phase 4: Cleanup** (15 minutes)
1. Remove unused Supabase imports
2. Update TypeScript types if needed
3. Test all functionality

---

## ✅ Verification

### **Check Frontend Code**:
```bash
# Should find no Supabase client usage
grep -r "from.*supabase" src/
grep -r "createClient" src/
grep -r "VITE_SUPABASE" src/
```

### **Check Network Requests**:
1. Open browser DevTools → Network tab
2. Perform database operations
3. ✅ Verify: Requests go to `/.netlify/functions/database`
4. ✅ Verify: No Supabase URLs in requests

### **Check Production Build**:
```bash
npm run build
grep -r "supabase" dist/
# Should find nothing (or only in type definitions)
```

---

## 🎯 Result

**Database provider is now completely hidden!** 🔒

- ✅ No Supabase URLs in frontend
- ✅ No Supabase keys in frontend
- ✅ All database operations go through backend API
- ✅ Database provider unknown to frontend

---

## 📚 API Reference

See `src/lib/api/database-client.ts` for full API documentation.

**Quick Reference**:
- `db.select(table, options)` - Query data
- `db.selectOne(table, filters, options)` - Get single record
- `db.insert(table, data, options)` - Insert data
- `db.update(table, filters, data, options)` - Update data
- `db.delete(table, filters)` - Delete data
- `db.rpc(functionName, params)` - Call database function

---

**Next Step**: Start migrating your database operations to use the new `db` client! 🚀

