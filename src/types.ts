export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type EmergencyLevel = 'Normal' | 'Urgent' | 'Critical';

export type RequestStatus = 'Open' | 'In Progress' | 'Fulfilled' | 'Cancelled';

export interface Donor {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: BloodGroup;
  phone: string;
  email: string;
  state?: string;
  city: string;
  pinCode?: string;
  location: string;
  lastDonationDate: string; // YYYY-MM-DD or 'Never'
  isAvailable: boolean;
  totalDonations: number;
  livesSaved: number;
  rating: number;
  responseTimeMinutes: number;
  verified: boolean;
  emergencyTravelReady: boolean;
  weightKg?: number;
  lat?: number;
  lng?: number;
  createdAt: string;
  avatar?: string;
  bio?: string;
}

export interface BloodRequest {
  id: string;
  patientName: string;
  requiredBloodGroup: BloodGroup;
  unitsNeeded: number;
  hospitalName: string;
  location: string;
  state?: string;
  city: string;
  pinCode?: string;
  contactNumber: string;
  alternateContact?: string;
  requiredDate: string; // YYYY-MM-DD or datetime string
  emergencyLevel: EmergencyLevel;
  status: RequestStatus;
  reason: string;
  requesterName: string;
  responsesCount: number;
  verified: boolean;
  createdAt: string;
  fulfilledAt?: string;
  assignedDonorName?: string;
  assignedDonorPhone?: string;
  notes?: string;
  lat?: number;
  lng?: number;
}

export interface DonationRecord {
  id: string;
  donorId: string;
  donorName: string;
  donationDate: string;
  hospitalName: string;
  state?: string;
  city: string;
  bloodGroup: BloodGroup;
  units: number;
  patientName?: string;
  certificateId: string;
  verifiedByHospital: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'emergency' | 'match' | 'system' | 'reminder';
  timestamp: string;
  read: boolean;
  tabTarget?: NavigationTab;
  requestId?: string;
}

export type NavigationTab = 
  | 'home' 
  | 'find-donor' 
  | 'register-donor' 
  | 'request-blood' 
  | 'emergency-alerts' 
  | 'donor-dashboard' 
  | 'admin-dashboard'
  | 'compatibility-guide'
  | 'eligibility-checker'
  | 'about'
  | 'download-apk';

export interface AuthUser {
  id: string;
  name: string;
  authMethod: 'email' | 'mobile';
  email?: string;
  mobile?: string;
  bloodGroup?: BloodGroup;
  role: 'donor' | 'requester' | 'admin';
  city?: string;
  state?: string;
  avatar?: string;
  createdAt: string;
  isDonorProfileLinked?: boolean;
  donorId?: string;
}

export interface BloodInventoryItem {
  bloodGroup: BloodGroup;
  unitsAvailable: number;
  demandLevel: 'Low' | 'Normal' | 'High' | 'Critical';
  urgentRequestsCount: number;
  compatibleRecipients: BloodGroup[];
  compatibleDonors: BloodGroup[];
  unitsInStock?: number;
  status?: string;
  demandScore?: number | string;
}

export interface EligibilityAnswer {
  age: number;
  weight: number;
  lastDonationMonthsAgo: number;
  hasTattooRecent: boolean;
  hasChronicCondition: boolean;
  isPregnantOrNursing: boolean;
  hasRecentFeverOrCold: boolean;
  hemoglobinNormal: boolean;
}
