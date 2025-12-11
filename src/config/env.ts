// src/config/env.ts
import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "development" | "production";
  jwt_Access_secret: string;
  jwt_Access_EXPIRES_IN: string;
  BCRYPT_SALT_ROUNDS: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
}

const loadEnvironmentVariables = (): EnvConfig => {
  const requiredVars = [
    "PORT",
    "DB_URL",
    "NODE_ENV",
    "jwt_Access_secret",
    "jwt_Access_EXPIRES_IN",
    "BCRYPT_SALT_ROUNDS",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
  ];

  requiredVars.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  });

  return {
    PORT: process.env.PORT!,
    DB_URL: process.env.DB_URL!,
    NODE_ENV: process.env.NODE_ENV! as "development" | "production",
    jwt_Access_secret: process.env.jwt_Access_secret!,
    jwt_Access_EXPIRES_IN: process.env.jwt_Access_EXPIRES_IN!,
    BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS!,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL!,
  };
};

export const envVars = loadEnvironmentVariables();
