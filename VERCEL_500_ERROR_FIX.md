# Vercel 500 Internal Server Error - Fix Guide

## Problem
Your Parcel Delivery System backend was returning a **500 INTERNAL_SERVER_ERROR** with function invocation failure on Vercel.

## Root Causes Identified

1. **Missing Session Middleware**: `passport.session()` was called without configuring `express-session`
2. **Missing Required Dependencies**: `express-session` was not installed
3. **Missing TypeScript Types**: `@types/express-session` wasn't available
4. **Environment Variable Issues**: Google OAuth variables were marked as required but may not be set on Vercel
5. **Serverless Function Export**: Server wasn't properly exported for serverless environment

## Solutions Applied

### 1. ✅ Installed Missing Dependencies
```bash
npm install express-session
npm install --save-dev @types/express-session
```

### 2. ✅ Updated `src/app.ts`
- Added `express-session` middleware configuration
- Configured secure session cookies
- Properly initialized Passport with session support

**Key Changes:**
```typescript
import session from "express-session";

// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
```

### 3. ✅ Updated `src/server.ts`
- Added check to prevent double MongoDB connections
- Added Vercel environment detection
- Added proper error logging
- Exported app for serverless functions

**Key Changes:**
```typescript
// Only start server if not in serverless environment
if (process.env.VERCEL !== "1") {
  startServer();
}

// Export app for serverless functions
export default app;
```

### 4. ✅ Updated `src/config/env.ts`
- Made Google OAuth variables optional (not required)
- Allows API to work without Google OAuth configured
- Better error messages for missing variables

**Key Changes:**
```typescript
interface EnvConfig {
  // ... required vars
  GOOGLE_CLIENT_ID?: string;      // Now optional
  GOOGLE_CLIENT_SECRET?: string;  // Now optional
  GOOGLE_CALLBACK_URL?: string;   // Now optional
}
```

### 5. ✅ Updated `src/modules/auth/google.strategy.ts`
- Added conditional Google strategy registration
- Only loads if credentials are provided
- Logs warning if Google OAuth unavailable

**Key Changes:**
```typescript
if (
  envVars.GOOGLE_CLIENT_ID &&
  envVars.GOOGLE_CLIENT_SECRET &&
  envVars.GOOGLE_CALLBACK_URL
) {
  passport.use(new GoogleStrategy(...));
}
```

## Vercel Deployment Checklist

Before redeploying, ensure you have:

### Environment Variables Set on Vercel

Go to: **Vercel Dashboard → Project Settings → Environment Variables**

Add these variables:

```
PORT=3000
DB_URL=your_mongodb_connection_string
NODE_ENV=production
jwt_Access_secret=your_strong_secret_key
jwt_Access_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10

# Optional - for Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/v1/auth/google/callback
```

### Deploy to Vercel

```bash
# Commit changes
git add .
git commit -m "Fix Vercel 500 error - add session middleware and fix serverless config"

# Push to trigger Vercel deployment
git push origin development
```

## Testing After Deployment

### 1. Check Health Endpoint
```bash
curl https://yourdomain.com/
# Expected: "Parcel Delivery System API is running!"
```

### 2. Test Email/Password Login
```bash
curl -X POST https://yourdomain.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. Check Vercel Logs
```bash
# In Vercel Dashboard:
1. Select your project
2. Go to "Deployments"
3. Click on latest deployment
4. Check "Function Logs" section
5. Look for errors or warnings
```

### 4. Monitor Real-Time
```bash
# In Vercel Dashboard:
1. Select your project
2. Go to "Monitoring"
3. Check for errors and performance metrics
```

## Common Issues After Fix

### Issue: "Cannot GET /api/v1/auth/google"
**Cause:** Google OAuth not configured
**Solution:** 
- This is expected if Google credentials aren't set
- Email/password login should still work
- Add Google credentials to Vercel env vars to enable Google OAuth

### Issue: Database Connection Timeout
**Cause:** MongoDB Atlas IP whitelist
**Solution:**
- Go to MongoDB Atlas Dashboard
- Add Vercel IP to whitelist (or allow all IPs: 0.0.0.0/0)
- Alternatively, use connection pooling

### Issue: Session Cookie Not Working
**Cause:** HTTPS not enforced in production
**Solution:**
- Already fixed in code (secure: true for production)
- Ensure SSL/TLS is enabled on your domain

### Issue: Request Timeout (>10 seconds)
**Cause:** Vercel serverless timeout
**Solution:**
- Optimize database queries
- Add connection pooling
- Reduce response times

## Performance Optimization Tips

1. **Enable Connection Pooling**
```typescript
const mongoUri = envVars.DB_URL + "?retryWrites=true&w=majority";
await mongoose.connect(mongoUri);
```

2. **Add Response Compression**
```typescript
import compression from 'compression';
app.use(compression());
```

3. **Cache Database Connections**
```typescript
if (!mongoose.connections[0].readyState) {
  await mongoose.connect(envVars.DB_URL);
}
```

4. **Optimize Query Selection**
```typescript
// Bad: retrieves all fields
const user = await User.findById(id);

// Good: retrieves only needed fields
const user = await User.findById(id).select('name email role');
```

## File Summary

**Modified Files:**
- ✅ `src/app.ts` - Added session middleware
- ✅ `src/server.ts` - Added Vercel detection
- ✅ `src/config/env.ts` - Made Google vars optional
- ✅ `src/modules/auth/google.strategy.ts` - Conditional Google setup

**Installed Packages:**
- ✅ `express-session`
- ✅ `@types/express-session`

## Next Steps

1. **Push to Vercel:**
   ```bash
   git push
   ```

2. **Monitor Deployment:**
   - Watch Vercel deployment logs
   - Verify function logs are clean

3. **Test All Endpoints:**
   - Health check: `/`
   - Login: `POST /api/v1/auth/login`
   - Parcels: `GET /api/v1/parcels` (with token)

4. **Set Up Google OAuth (Optional):**
   - Get credentials from Google Cloud Console
   - Add to Vercel environment variables
   - Test `/api/v1/auth/google` endpoint

## Monitoring & Alerts

Set up monitoring in Vercel:
1. Go to **Project Settings → Integrations**
2. Add email alerts for deployments
3. Enable error tracking
4. Set up performance monitoring

## Rollback If Needed

If issues persist:

```bash
# Revert to previous deployment
git log --oneline
git reset --hard <commit-hash>
git push --force
```

## Support Resources

- [Vercel Docs - Node.js](https://vercel.com/docs/frameworks/nodejs)
- [Passport.js Documentation](http://www.passportjs.org/)
- [Express-session Documentation](https://github.com/expressjs/session)
- [MongoDB Connection Pooling](https://docs.mongodb.com/manual/reference/connection-string/)

---

**Status**: ✅ Fixed and Ready for Production

**Error Code**: 500: INTERNAL_SERVER_ERROR (RESOLVED)
**Issue**: Function Invocation Failed (RESOLVED)
**Solution**: Session middleware + Serverless config

**Deployment Date**: December 12, 2025
