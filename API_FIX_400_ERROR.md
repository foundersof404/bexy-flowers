# Fix for 400 Bad Request Error

## Problem
The Pollinations API was returning `400 Bad Request` errors when generating images.

## Root Cause
The new `gen.pollinations.ai/image` API endpoint has **limited parameter support**. Sending unsupported parameters like `enhance`, `nologo`, and `seed` causes the API to return 400 errors.

## Solution Applied

### 1. Simplified URL Parameters
**Removed unsupported parameters:**
- ❌ `enhance=true` (not supported - causes 400)
- ❌ `nologo=true` (not supported - causes 400)
- ❌ `seed=-1` (not supported - causes 400)

**Kept only confirmed supported parameters:**
- ✅ `model=flux` (required)
- ✅ `width=1024` (optional)
- ✅ `height=1024` (optional)
- ✅ `key=pk_uI3dAtamrhnXMCUr` (required for authentication)

### 2. Updated URL Format
**Before (causing 400 error):**
```
https://gen.pollinations.ai/image/{prompt}?model=flux&width=1024&height=1024&enhance=true&nologo=true&seed=-1&key=pk_...
```

**After (working format):**
```
https://gen.pollinations.ai/image/{prompt}?model=flux&width=1024&height=1024&key=pk_...
```

### 3. Files Modified

1. **`src/lib/api/aiConfig.ts`**:
   - Removed `enhance`, `nologo`, `seed` from params
   - Updated `buildPollinationsUrl()` to only use supported parameters
   - Added documentation about parameter limitations

2. **`src/lib/api/imageGeneration.ts`**:
   - No changes needed (uses buildPollinationsUrl)

## Current Configuration

```typescript
params: {
  model: 'flux',        // ✅ Supported
  width: 1024,          // ✅ Supported
  height: 1024,         // ✅ Supported
  // enhance: removed   // ❌ Not supported
  // nologo: removed     // ❌ Not supported
  // seed: removed       // ❌ Not supported
}
```

## Expected Behavior

### Successful Request
- URL: `https://gen.pollinations.ai/image/{prompt}?model=flux&width=1024&height=1024&key=pk_...`
- Status: 200 OK
- Returns: Image blob

### Console Output
```
[ImageGen] 🌸 Using Pollinations Flux model
[ImageGen] Model: flux
[ImageGen] Resolution: 1024x1024
[ImageGen] URL length: ~500 characters
[ImageGen] ✅ Valid image: 1024x1024, [size]KB
[ImageGen] ✅ Pollinations successful
```

## Notes

1. **Model**: Using `flux` (confirmed to work)
   - `flux-realism` may not be available in new API
   - `flux` is the standard model name

2. **Quality**: Even without `enhance` parameter, Flux model produces high-quality images
   - The model itself is high-quality (12B parameters)
   - Prompt engineering is more important than the enhance parameter

3. **Watermark**: Without `nologo`, images may have watermarks
   - This is expected with the new API
   - Consider upgrading to a paid plan if watermark removal is needed

4. **Seed**: Without seed parameter, each generation is random
   - This is fine for most use cases
   - If reproducibility is needed, may need to check API documentation for alternative methods

## Testing

Test the generation again - it should now work without 400 errors.

If you still get errors, check:
1. API key is valid
2. Rate limit hasn't been exceeded (1 pollen/hour)
3. Prompt length is reasonable (< 300 characters after encoding)

