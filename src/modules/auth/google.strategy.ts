// src/modules/auth/google.strategy.ts

import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { User } from "../user/user.model";
import { envVars } from "../../config/env";
import { Role, IUser } from "../user/user.interface";

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const picture = profile.photos?.[0]?.value;

        // Check if user already exists
        let user = await User.findOne({ email });

        if (user) {
          // Check if Google auth is already linked
          const googleAuth = user.auths?.find(
            (auth) => auth.provider === "google"
          );

          if (!googleAuth) {
            // Add Google authentication to existing user
            user.auths = user.auths || [];
            user.auths.push({
              provider: "google",
              id: profile.id,
              providerID: profile.id,
            });
            await user.save();
          }
        } else {
          // Create new user
          user = await User.create({
            name,
            email,
            picture,
            role: Role.SENDER, // Default role
            auths: [
              {
                provider: "google",
                id: profile.id,
                providerID: profile.id,
              },
            ],
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, undefined);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user: IUser | Express.User, done) => {
  const userObj = user as IUser;
  done(null, userObj._id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
