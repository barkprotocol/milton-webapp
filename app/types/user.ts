import { PublicKey } from '@solana/web3.js';

export type UserRole = 'user' | 'admin' | 'moderator';

export interface UserWallet {
  publicKey: PublicKey;
  balance: {
    sol: number;
    milton: number;
    usdc: number;
  };
}

export interface UserProfile {
  displayName: string;
  avatar: string | null;
  bio: string;
  socialLinks: {
    twitter?: string;
    discord?: string;
    telegram?: string;
  };
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  twoFactorEnabled: boolean;
}

export interface UserActivity {
  lastLogin: Date;
  lastTransaction: Date | null;
  totalTransactions: number;
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  isBanned: boolean;
  wallet: UserWallet;
  profile: UserProfile;
  preferences: UserPreferences;
  activity: UserActivity;
  referralCode: string;
  referredBy: string | null;
}

export interface UserCreateInput {
  email: string;
  username: string;
  password: string;
  role?: UserRole;
}

export interface UserUpdateInput {
  email?: string;
  username?: string;
  role?: UserRole;
  isVerified?: boolean;
  isBanned?: boolean;
  profile?: Partial<UserProfile>;
  preferences?: Partial<UserPreferences>;
}

export interface UserLoginInput {
  email: string;
  password: string;
}

export interface UserLoginResponse {
  user: User;
  token: string;
}

export interface UserWithToken extends User {
  token: string;
}