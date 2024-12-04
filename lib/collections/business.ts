"use client";

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface BusinessInfo {
  id: string;
  name: string;
  email?: string;
  settings?: {
    business?: {
      name: string;
      tagline?: string;
      about?: string;
      coverImage?: string;
      logo?: string;
      phone?: string;
      address?: string;
      businessHours?: Record<string, string>;
      socialLinks?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        linkedin?: string;
      };
    };
  };
}

export async function getBusinessInfo(userId: string): Promise<BusinessInfo> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      throw new Error('Business not found');
    }

    const settingsDoc = await getDoc(doc(db, 'users', userId, 'settings', 'preferences'));
    const businessData = userDoc.data();
    const settings = settingsDoc.exists() ? settingsDoc.data() : null;

    return {
      ...businessData,
      settings,
      id: userId,
      name: settings?.business?.name || businessData.name || 'Business Name'
    };
  } catch (error) {
    console.error('Error fetching business info:', error);
    throw error;
  }
}