import { BloodGroup } from '../types';

export const COMPATIBLE_DONORS_MAP: Record<BloodGroup, BloodGroup[]> = {
  'O-': ['O-'],
  'O+': ['O+', 'O-'],
  'A-': ['A-', 'O-'],
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'AB+': ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
};

export const COMPATIBLE_RECIPIENTS_MAP: Record<BloodGroup, BloodGroup[]> = {
  'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+'],
};

export const BLOOD_GROUP_INFO: Record<BloodGroup, {
  name: string;
  rarityPercentage: number;
  description: string;
  isUniversalDonor?: boolean;
  isUniversalRecipient?: boolean;
  idealDonationType: string;
}> = {
  'O-': {
    name: 'O Negative',
    rarityPercentage: 7,
    description: 'Universal red blood cell donor. First choice for emergency transfusions and newborn babies.',
    isUniversalDonor: true,
    idealDonationType: 'Whole Blood / Power Red',
  },
  'O+': {
    name: 'O Positive',
    rarityPercentage: 37,
    description: 'Most common blood type in the population. Extremely high continuous demand in trauma centers.',
    idealDonationType: 'Whole Blood / Double Red Cell',
  },
  'A-': {
    name: 'A Negative',
    rarityPercentage: 6,
    description: 'Can donate to A and AB recipients. Highly sought for platelet and plasma donations.',
    idealDonationType: 'Whole Blood / Platelets',
  },
  'A+': {
    name: 'A Positive',
    rarityPercentage: 36,
    description: 'Second most common blood type. Platelets from A+ are universally vital for cancer patients.',
    idealDonationType: 'Platelets / Plasma',
  },
  'B-': {
    name: 'B Negative',
    rarityPercentage: 2,
    description: 'One of the rarest blood types. Crucial for ongoing sickle cell disease treatments.',
    idealDonationType: 'Whole Blood / Red Blood Cells',
  },
  'B+': {
    name: 'B Positive',
    rarityPercentage: 8,
    description: 'Can donate red blood cells to B+ and AB+ individuals. Always in active medical need.',
    idealDonationType: 'Whole Blood / Platelets',
  },
  'AB-': {
    name: 'AB Negative',
    rarityPercentage: 1,
    description: 'The rarest blood type on Earth. Universal plasma donor for all emergency patients.',
    idealDonationType: 'Plasma / Platelets',
  },
  'AB+': {
    name: 'AB Positive',
    rarityPercentage: 3,
    description: 'Universal red cell recipient. Can receive blood from any group and donate universal plasma.',
    isUniversalRecipient: true,
    idealDonationType: 'Plasma / Platelets',
  },
};

export function canDonateBlood(donorGroup: BloodGroup, recipientGroup: BloodGroup): boolean {
  return COMPATIBLE_DONORS_MAP[recipientGroup]?.includes(donorGroup) ?? false;
}

export function getCompatibleDonorsForRecipient(recipientGroup: BloodGroup): BloodGroup[] {
  return COMPATIBLE_DONORS_MAP[recipientGroup] || [recipientGroup];
}

export function getCompatibleRecipientsForDonor(donorGroup: BloodGroup): BloodGroup[] {
  return COMPATIBLE_RECIPIENTS_MAP[donorGroup] || [donorGroup];
}

/**
 * Calculates days remaining until a donor can donate again (standard 56-day whole blood interval)
 */
export function calculateDaysUntilEligible(lastDonationDateStr: string): {
  isEligible: boolean;
  daysRemaining: number;
  eligibleDateStr: string;
} {
  if (!lastDonationDateStr || lastDonationDateStr === 'Never') {
    return { isEligible: true, daysRemaining: 0, eligibleDateStr: 'Immediately' };
  }

  const lastDate = new Date(lastDonationDateStr);
  if (isNaN(lastDate.getTime())) {
    return { isEligible: true, daysRemaining: 0, eligibleDateStr: 'Immediately' };
  }

  const eligibleDate = new Date(lastDate);
  eligibleDate.setDate(eligibleDate.getDate() + 56); // 56 days for standard whole blood

  const today = new Date();
  const diffTime = eligibleDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return { isEligible: true, daysRemaining: 0, eligibleDateStr: 'Immediately' };
  }

  return {
    isEligible: false,
    daysRemaining: diffDays,
    eligibleDateStr: eligibleDate.toISOString().split('T')[0],
  };
}

/**
 * Distance approximation between two locations (coordinates or approximate relative km)
 */
export function calculateDistanceKm(
  lat1: number = 40.7128,
  lon1: number = -74.006,
  lat2: number = 40.7306,
  lon2: number = -73.9352
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}
