# Backend Google Login Implementation Prompt

You are tasked with implementing Google OAuth 2.0 authentication for the Parcel Delivery System backend. Here's what needs to be done:

## Current Status
✅ Google OAuth dependencies installed (passport, passport-google-oauth20)
✅ TypeScript types configured
✅ Core files modified (app.ts, auth files, env.ts)
✅ Routes and controllers updated
✅ Documentation created

## Your Task: Complete Backend Implementation

### Step 1: Verify Google Strategy Configuration
- [ ] Check `src/modules/auth/google.strategy.ts` exists and is properly configured
- [ ] Verify Passport GoogleStrategy uses correct configuration from environment variables
- [ ] Confirm serializeUser and deserializeUser are implemented
- [ ] Ensure strategy handles both new user creation and existing user linking

### Step 2: Verify Environment Variables
- [ ] Add to `.env` file:
  ```env
  GOOGLE_CLIENT_ID=your_client_id_here
  GOOGLE_CLIENT_SECRET=your_client_secret_here
  GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback
  ```
- [ ] Verify `src/config/env.ts` exports these variables
- [ ] Test that env variables are accessible without errors

### Step 3: Test Google Login Flow
1. **Start the backend server:**
   ```bash
   npm run dev
   ```

2. **Test endpoint accessibility:**
   - Visit: `http://localhost:5000/api/v1/auth/google`
   - Should redirect to Google consent screen

3. **Verify callback handling:**
   - After Google authorization
   - Should redirect to callback URL
   - Should return JWT token and user data

4. **Check database:**
   - Verify user created in MongoDB
   - Check `auths` array contains Google provider info
   - Confirm profile picture saved

### Step 4: Test Credentials Login (Fallback)
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```
- Should return JWT token
- Token should match Google login response format

### Step 5: Test Account Linking
1. Create user via credentials login
2. Log out
3. Try logging in with Google using same email
4. Verify user updated, not duplicated
5. Check `auths` array has both methods

### Step 6: Verify JWT Token Usage
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5000/api/v1/parcels
```
- Protected routes should work with token
- Should return 401 without valid token

### Step 7: Error Handling
Test these scenarios:
- [ ] Invalid Google credentials
- [ ] Missing environment variables
- [ ] Database connection failure
- [ ] Invalid JWT token
- [ ] Expired token

### Step 8: Security Verification
- [ ] JWT secret is strong (32+ characters)
- [ ] Google credentials never logged
- [ ] Sensitive data in environment variables only
- [ ] CORS properly configured for frontend domain
- [ ] Rate limiting on auth endpoints

## Expected Response Format

All endpoints should return:
```json
{
  "success": true,
  "StatusCodes": 200,
  "message": "Google login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "user_id",
      "email": "user@gmail.com",
      "name": "User Name",
      "picture": "https://...",
      "role": "SENDER"
    }
  }
}
```

## Files to Verify

- ✅ `src/app.ts` - Passport initialized
- ✅ `src/config/env.ts` - Google vars exported
- ✅ `src/modules/auth/google.strategy.ts` - Strategy configured
- ✅ `src/modules/auth/auth.service.ts` - googleLogin() method
- ✅ `src/modules/auth/auth.controller.ts` - Callback handler
- ✅ `src/modules/auth/auth.route.ts` - Routes defined
- ✅ `.env.example` - Updated with Google config

## Documentation References

- **Quick Start**: `GOOGLE_LOGIN_QUICK_REFERENCE.md`
- **Detailed Setup**: `GOOGLE_LOGIN_SETUP.md`
- **Implementation Details**: `GOOGLE_LOGIN_IMPLEMENTATION.md`

## Success Criteria

✅ Google login redirects to Google consent screen
✅ Callback receives and processes authorization
✅ User created in database with Google auth info
✅ JWT token returned with correct format
✅ Existing users can link Google account
✅ All protected routes accept JWT token
✅ Error handling works correctly
✅ No sensitive data exposed in logs

## Troubleshooting

If issues occur, check:
1. **Redirect URI mismatch**: Verify GOOGLE_CALLBACK_URL
2. **Client not found**: Check GOOGLE_CLIENT_ID and SECRET in .env
3. **CORS errors**: Add frontend domain to Google authorized origins
4. **User not created**: Check database connection
5. **Token invalid**: Verify JWT_SECRET is consistent

## Next Steps

Once backend is verified:
1. Get Google OAuth credentials from Google Cloud Console
2. Configure environment variables
3. Test all flows manually
4. Prepare for frontend integration
5. Document any custom modifications

---

**Ready for frontend integration once all tests pass!**
