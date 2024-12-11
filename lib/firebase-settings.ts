"use client";

import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from './firebase';

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
}

export interface BusinessSettings {
  name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  currency: string;
  timezone: string;
  // Landing page settings
  tagline: string;
  about: string;
  coverImage: string;
  logo: string;
  businessHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  appointmentReminders: boolean;
  marketingEmails: boolean;
  reminderTime: string;
}

export interface BookingSettings {
  enabled: boolean;
  requireApproval: boolean;
  allowCancellations: boolean;
  cancellationWindow: string;
  maxAdvanceBooking: string;
  minAdvanceBooking: string;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  passwordResetInterval: string;
  sessionTimeout: string;
}

export interface UserSettings {
  business: BusinessSettings;
  appearance: AppearanceSettings;
  notifications: NotificationSettings;
  booking: BookingSettings;
  security: SecuritySettings;
  theme: string;
  updatedAt: string;
}

const defaultSettings: UserSettings = {
  business: {
    name: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    currency: "USD",
    timezone: "America/New_York",
    tagline: "",
    about: "",
    coverImage: "",
    logo: "",
    businessHours: {
      monday: "9:00 AM - 5:00 PM",
      tuesday: "9:00 AM - 5:00 PM",
      wednesday: "9:00 AM - 5:00 PM",
      thursday: "9:00 AM - 5:00 PM",
      friday: "9:00 AM - 5:00 PM",
      saturday: "Closed",
      sunday: "Closed"
    },
    socialLinks: {}
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: true,
    appointmentReminders: true,
    marketingEmails: false,
    reminderTime: "24",
  },
  booking: {
    enabled: true,
    requireApproval: true,
    allowCancellations: true,
    cancellationWindow: "24",
    maxAdvanceBooking: "30",
    minAdvanceBooking: "24",
  },
  security: {
    twoFactorAuth: false,
    passwordResetInterval: "never",
    sessionTimeout: "24h",
  },
  theme: "system",
  updatedAt: new Date().toISOString(),
};

export async function getUserSettings(): Promise<UserSettings> {
  const user = auth.currentUser;
  if (!user) throw new Error('Authentication required');

  try {
    const settingsDoc = await getDoc(doc(db, 'users', user.uid, 'settings', 'preferences'));
    
    if (!settingsDoc.exists()) {
      // Initialize default settings if none exist
      await setDoc(doc(db, 'users', user.uid, 'settings', 'preferences'), defaultSettings);
      return defaultSettings;
    }

    return settingsDoc.data() as UserSettings;
  } catch (error) {
    console.error('Error fetching user settings:', error);
    throw error;
  }
}

export async function updateUserSettings(settings: Partial<UserSettings>): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('Authentication required');

  try {
    const updatedSettings = {
      ...settings,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(doc(db, 'users', user.uid, 'settings', 'preferences'), updatedSettings);
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw error;
  }
}

export async function updateBusinessSettings(settings: Partial<BusinessSettings>): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('Authentication required');

  try {
    await updateDoc(doc(db, 'users', user.uid, 'settings', 'preferences'), {
      business: settings,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating business settings:', error);
    throw error;
  }
}

export async function updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('Authentication required');

  try {
    await updateDoc(doc(db, 'users', user.uid, 'settings', 'preferences'), {
      notifications: settings,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    throw error;
  }
}

export async function updateBookingSettings(settings: Partial<BookingSettings>): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('Authentication required');

  try {
    await updateDoc(doc(db, 'users', user.uid, 'settings', 'preferences'), {
      booking: settings,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating booking settings:', error);
    throw error;
  }
}

export async function updateSecuritySettings(settings: Partial<SecuritySettings>): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('Authentication required');

  try {
    await updateDoc(doc(db, 'users', user.uid, 'settings', 'preferences'), {
      security: settings,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating security settings:', error);
    throw error;
  }
}

export async function updateThemeSetting(theme: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('Authentication required');

  try {
    await updateDoc(doc(db, 'users', user.uid, 'settings', 'preferences'), {
      theme,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating theme setting:', error);
    throw error;
  }
}


export async function updateAppearanceSettings(settings: AppearanceSettings): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('Authentication required');

  try {
    const settingsRef = doc(db, 'users', user.uid, 'settings', 'preferences');
    await updateDoc(settingsRef, {
      appearance: settings,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating appearance settings:', error);
    throw error;
  }
}
