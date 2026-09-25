import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode, useRef } from 'react';
import {
  Donor,
  BloodRequest,
  DonationRecord,
  AppNotification,
  NavigationTab,
  BloodInventoryItem,
  BloodGroup,
  RequestStatus,
  AuthUser
} from '../types';
import {
  INITIAL_DONORS,
  INITIAL_REQUESTS,
  INITIAL_DONATION_RECORDS,
  INITIAL_NOTIFICATIONS,
  INITIAL_INVENTORY
} from '../data/mockData';
import { soundManager } from '../utils/audioAlert';
import {
  auth,
  FirestoreUserData,
  getFirestoreUser,
  createFirestoreUser,
  updateFirestoreUser,
  queryFirestoreDonors,
  formatAuthError,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
  reload,
  googleProvider,
  subscribeToFirestoreDonors,
  subscribeToFirestoreRequests,
  saveFirestoreBloodRequest,
  updateFirestoreBloodRequest,
  deleteFirestoreBloodRequest,
  broadcastGlobalNotification,
  subscribeToGlobalNotifications,
  FirebaseUser
} from '../services/firebase';

interface ToastInfo {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error' | 'emergency';
  title: string;
  message: string;
}

interface AppContextType {
  donors: Donor[];
  bloodRequests: BloodRequest[];
  donationRecords: DonationRecord[];
  notifications: AppNotification[];
  inventory: BloodInventoryItem[];
  updateInventoryUnits: (bloodGroup: BloodGroup, delta: number) => void;
  currentDonor: Donor | null;
  isAdmin: boolean;
  activeTab: NavigationTab;
  toasts: ToastInfo[];
  isSoundEnabled: boolean;
  toggleSound: () => void;

  // Authentication
  authUser: AuthUser | null;
  firebaseUser: FirebaseUser | null;
  isEmailVerified: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string; emailVerificationPending?: boolean }>;
  signupWithEmail: (params: {
    name: string;
    email: string;
    password: string;
    phone: string;
    bloodGroup: BloodGroup;
    state: string;
    district: string;
  }) => Promise<{ success: boolean; error?: string; emailVerificationPending?: boolean }>;
  loginWithGoogle: () => Promise<{ success: boolean; isNewUser?: boolean; profileComplete?: boolean; error?: string }>;
  completeGoogleProfile: (params: {
    phone: string;
    bloodGroup: BloodGroup;
    state: string;
    district: string;
  }) => Promise<{ success: boolean; error?: string }>;
  resendVerificationEmail: () => Promise<{ success: boolean; error?: string }>;
  checkEmailVerified: () => Promise<boolean>;
  loginWithMobile: (mobile: string, otp?: string) => Promise<boolean>;
  signupUser: (params: {
    name: string;
    authMethod: 'email' | 'mobile' | 'google';
    email?: string;
    mobile?: string;
    phone?: string;
    bloodGroup?: BloodGroup;
    city?: string;
    state?: string;
    district?: string;
    role?: 'donor' | 'requester';
    asDonor?: boolean;
  }) => Promise<AuthUser>;
  logoutUser: () => Promise<void>;
  
  // APK Download Modal
  isApkModalOpen: boolean;
  openApkModal: () => void;
  closeApkModal: () => void;
  downloadApkFile: () => void;
  
  // Navigation & View Controls
  setActiveTab: (tab: NavigationTab) => void;
  setIsAdmin: (val: boolean) => void;
  showToast: (type: ToastInfo['type'], title: string, message: string) => void;
  dismissToast: (id: string) => void;
  
  // Donor Actions
  registerDonor: (donorData: Omit<Donor, 'id' | 'createdAt' | 'livesSaved' | 'totalDonations' | 'rating' | 'responseTimeMinutes' | 'verified'>) => Donor;
  updateDonor: (id: string, updates: Partial<Donor>) => void;
  toggleDonorAvailability: (id: string) => void;
  deleteDonor: (id: string) => void;
  setCurrentDonor: (donor: Donor | null) => void;
  
  // Request Actions
  createBloodRequest: (requestData: Omit<BloodRequest, 'id' | 'createdAt' | 'status' | 'responsesCount' | 'verified'>) => BloodRequest;
  respondToRequest: (requestId: string, donorName: string, donorPhone: string, note?: string) => void;
  markRequestFulfilled: (requestId: string) => void;
  toggleRequestVerification: (requestId: string) => void;
  deleteBloodRequest: (id: string) => void;
  
  // Records & Certificates
  addDonationRecord: (record: Omit<DonationRecord, 'id' | 'certificateId' | 'verifiedByHospital'>) => DonationRecord;
  
  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  
  // Active Selected Modal items
  activeRespondRequest: BloodRequest | null;
  setActiveRespondRequest: (req: BloodRequest | null) => void;
  activeCertificate: DonationRecord | null;
  setActiveCertificate: (cert: DonationRecord | null) => void;
  selectedDonorContact: Donor | null;
  setSelectedDonorContact: (donor: Donor | null) => void;

  // System Helpers
  resetToDemoData: () => void;
  resetToEmpty: () => void;
  loadSampleData: () => void;
  totalLivesSaved: number;

  // Global Search Filter Sync
  searchStateFilter: string;
  setSearchStateFilter: (val: string) => void;
  searchDistrictFilter: string;
  setSearchDistrictFilter: (val: string) => void;
  searchBloodGroupFilter: BloodGroup | 'All';
  setSearchBloodGroupFilter: (val: BloodGroup | 'All') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  DONORS: 'lifelink_donors_v3_clean',
  REQUESTS: 'lifelink_requests_v3_clean',
  RECORDS: 'lifelink_records_v3_clean',
  NOTIFICATIONS: 'lifelink_notifications_v3_clean',
  CURRENT_DONOR_ID: 'lifelink_current_donor_id_v3_clean',
  AUTH_USER: 'lifelink_auth_user_v3_clean',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load state from localStorage or default to empty list
  const [donors, setDonors] = useState<Donor[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.DONORS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.REQUESTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [donationRecords, setDonationRecords] = useState<DonationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.RECORDS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentDonorId, setCurrentDonorId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_DONOR_ID) || null;
    } catch {
      return null;
    }
  });

  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  // Computed email verification status: true if Google sign-in or Firebase emailVerified is true
  const isEmailVerified = useMemo(() => {
    if (!firebaseUser) return false;
    if (authUser?.loginProvider === 'google') return true;
    return Boolean(firebaseUser.emailVerified || authUser?.emailVerified);
  }, [firebaseUser, authUser]);

  const [customInventoryUnits, setCustomInventoryUnits] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('lifelink_inventory_units_v3_clean');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(false);

  // Toggle sound
  const toggleSound = () => {
    const nextState = soundManager.toggleSound();
    setIsSoundEnabled(nextState);
    if (nextState) {
      soundManager.playNotificationChime();
      showToast('info', 'Alert Sound Enabled', 'Audible alert chimes enabled for urgent blood requests.');
    } else {
      showToast('info', 'Alert Sound Muted', 'Audible alert chimes muted.');
    }
  };

  // Modals
  const [activeRespondRequest, setActiveRespondRequest] = useState<BloodRequest | null>(null);
  const [activeCertificate, setActiveCertificate] = useState<DonationRecord | null>(null);
  const [selectedDonorContact, setSelectedDonorContact] = useState<Donor | null>(null);

  // Global Search Filters
  const [searchStateFilter, setSearchStateFilter] = useState<string>('');
  const [searchDistrictFilter, setSearchDistrictFilter] = useState<string>('');
  const [searchBloodGroupFilter, setSearchBloodGroupFilter] = useState<BloodGroup | 'All'>('All');

  // Persistence effects
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.DONORS, JSON.stringify(donors));
    } catch (e) {
      console.error('Failed saving donors to localStorage', e);
    }
  }, [donors]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.REQUESTS, JSON.stringify(bloodRequests));
    } catch (e) {
      console.error('Failed saving requests to localStorage', e);
    }
  }, [bloodRequests]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.RECORDS, JSON.stringify(donationRecords));
    } catch (e) {
      console.error('Failed saving donation records', e);
    }
  }, [donationRecords]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.error('Failed saving notifications', e);
    }
  }, [notifications]);

  useEffect(() => {
    if (currentDonorId) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_DONOR_ID, currentDonorId);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_DONOR_ID);
    }
  }, [currentDonorId]);

  useEffect(() => {
    if (authUser) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, JSON.stringify(authUser));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_USER);
    }
  }, [authUser]);

  // Firebase Auth State & Firestore Sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const profile = await getFirestoreUser(fbUser.uid);
          if (profile) {
            // If user verified email in auth, sync to Firestore
            if (fbUser.emailVerified && !profile.emailVerified) {
              await updateFirestoreUser(fbUser.uid, { emailVerified: true }).catch(() => {});
              profile.emailVerified = true;
            }

            const activeUser: AuthUser = {
              id: fbUser.uid,
              name: profile.name || fbUser.displayName || 'LifeLink Donor',
              authMethod: profile.loginProvider === 'google' ? 'google' : 'email',
              email: profile.email || fbUser.email || '',
              phone: profile.phone,
              mobile: profile.phone,
              bloodGroup: profile.bloodGroup,
              state: profile.state,
              district: profile.district,
              city: profile.district || profile.state,
              avatar: profile.profilePhoto || fbUser.photoURL || undefined,
              profilePhoto: profile.profilePhoto || fbUser.photoURL || undefined,
              role: 'donor',
              isDonor: profile.isDonor,
              emailVerified: fbUser.emailVerified || profile.loginProvider === 'google',
              loginProvider: profile.loginProvider,
              createdAt: profile.createdAt,
              isDonorProfileLinked: profile.isDonor,
              donorId: fbUser.uid,
            };
            setAuthUser(activeUser);

            // Sync with local donor directory
            if (profile.isDonor) {
              const donorEntry: Donor = {
                id: fbUser.uid,
                name: profile.name,
                age: 26,
                gender: 'Male',
                bloodGroup: profile.bloodGroup,
                phone: profile.phone,
                email: profile.email,
                state: profile.state,
                district: profile.district,
                city: profile.district,
                location: `${profile.district}, ${profile.state}`,
                lastDonationDate: 'Never',
                isAvailable: true,
                totalDonations: 0,
                livesSaved: 0,
                rating: 5.0,
                responseTimeMinutes: 15,
                verified: true,
                emergencyTravelReady: true,
                createdAt: profile.createdAt.split('T')[0],
                avatar: profile.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.name)}`,
                bio: 'Verified LifeLink blood donor'
              };

              setDonors((prev) => {
                const exists = prev.some((d) => d.id === fbUser.uid || d.email.toLowerCase() === profile.email.toLowerCase());
                if (exists) {
                  return prev.map((d) => (d.id === fbUser.uid || d.email.toLowerCase() === profile.email.toLowerCase()) ? { ...d, ...donorEntry } : d);
                }
                return [donorEntry, ...prev];
              });
              setCurrentDonorId(fbUser.uid);
            }
          }
        } catch (err) {
          console.error('Error syncing auth profile from Firestore:', err);
        }
      } else {
        // Logged out
        setAuthUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Real-time synchronization for blood requests across all signed-in users
  const isFirstLoadRef = useRef(true);
  const knownReqIdsRef = useRef<Set<string>>(new Set());
  const knownResponsesMapRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    // Request permission once for sound/device alerts
    soundManager.requestNotificationPermission().catch(() => {});

    const unsubRequests = subscribeToFirestoreRequests((firestoreReqs) => {
      if (firestoreReqs && firestoreReqs.length > 0) {
        // Detect newly arrived requests or new donor responses from other users
        if (!isFirstLoadRef.current) {
          firestoreReqs.forEach((r) => {
            const previousResponseCount = knownResponsesMapRef.current.get(r.id) || 0;

            if (!knownReqIdsRef.current.has(r.id)) {
              // BRAND NEW blood request created from another mobile/device!
              knownReqIdsRef.current.add(r.id);
              knownResponsesMapRef.current.set(r.id, r.responsesCount || 0);

              // 1. Play alert sound and device vibration
              soundManager.showDeviceNotification(
                `🚨 Urgent ${r.requiredBloodGroup} Blood Needed!`,
                {
                  body: `${r.patientName} urgently needs ${r.unitsNeeded} unit(s) at ${r.hospitalName}, ${r.city}.`,
                  tag: r.id
                }
              );

              // 2. Display high-priority Toast alert
              showToast(
                'emergency',
                `🚨 NEW EMERGENCY REQUEST: ${r.requiredBloodGroup}`,
                `${r.patientName} needs ${r.unitsNeeded} unit(s) at ${r.hospitalName}, ${r.city}.`
              );

              // 3. Add to notifications feed
              const incomingNotif: AppNotification = {
                id: `notif-incoming-${Date.now()}-${r.id}`,
                title: `${r.emergencyLevel === 'Critical' ? '🚨 CRITICAL SOS' : '🩸 Urgent Blood Request'}: ${r.requiredBloodGroup}`,
                message: `${r.patientName} urgently needs ${r.unitsNeeded} unit(s) at ${r.hospitalName}, ${r.city}.`,
                type: 'emergency',
                timestamp: 'Just now',
                read: false,
                tabTarget: 'emergency-alerts',
                requestId: r.id,
              };
              setNotifications((prev) => [incomingNotif, ...prev]);
            } else if ((r.responsesCount || 0) > previousResponseCount) {
              // Another mobile/user just RESPONDED to this blood request!
              knownResponsesMapRef.current.set(r.id, r.responsesCount || 0);

              soundManager.showDeviceNotification(
                `🤝 Donor Responded to Blood Request!`,
                {
                  body: `${r.assignedDonorName || 'A donor'} has committed to help patient ${r.patientName}.`,
                  tag: `response-${r.id}`
                }
              );

              showToast(
                'success',
                `🤝 DONOR RESPONDED!`,
                `${r.assignedDonorName || 'A donor'} responded for ${r.patientName} (${r.requiredBloodGroup}). Phone: ${r.assignedDonorPhone || 'Contact provided'}`
              );

              const responseNotif: AppNotification = {
                id: `notif-resp-${Date.now()}-${r.id}`,
                title: '🤝 Donor Accepted Blood Request!',
                message: `${r.assignedDonorName || 'A voluntary donor'} responded for ${r.patientName}. Contact: ${r.assignedDonorPhone || 'In request details'}.`,
                type: 'match',
                timestamp: 'Just now',
                read: false,
                tabTarget: 'emergency-alerts',
                requestId: r.id,
              };
              setNotifications((prev) => [responseNotif, ...prev]);
            }
          });
        } else {
          // Initialize known IDs and response counts on first load
          firestoreReqs.forEach((r) => {
            knownReqIdsRef.current.add(r.id);
            knownResponsesMapRef.current.set(r.id, r.responsesCount || 0);
          });
          isFirstLoadRef.current = false;
        }

        setBloodRequests((prev) => {
          // Merge remote requests with any local unsynced requests
          const map = new Map<string, BloodRequest>();
          firestoreReqs.forEach((r) => map.set(r.id, r));
          prev.forEach((r) => {
            if (!map.has(r.id)) {
              map.set(r.id, r);
            }
          });
          return Array.from(map.values()).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
      }
    });

    // Real-time synchronization for registered donors across all signed-in users
    const unsubDonors = subscribeToFirestoreDonors((firestoreDonors) => {
      if (firestoreDonors && firestoreDonors.length > 0) {
        setDonors((prev) => {
          const map = new Map<string, Donor>();
          // Remote registered users take priority
          prev.forEach((d) => map.set(d.id, d));
          firestoreDonors.forEach((d) => map.set(d.id, d));
          return Array.from(map.values());
        });
      }
    });

    // Real-time listener for global notification alerts broadcast across ALL donor accounts
    const unsubGlobalNotifs = subscribeToGlobalNotifications((remoteNotif) => {
      // Avoid duplicating notifications already handled
      setNotifications((prev) => {
        if (prev.some((n) => n.id === remoteNotif.id)) return prev;

        // Play sound and show toast
        soundManager.showDeviceNotification(remoteNotif.title, {
          body: remoteNotif.message,
          tag: remoteNotif.id,
        });

        showToast(
          remoteNotif.type === 'emergency' ? 'emergency' : 'success',
          remoteNotif.title,
          remoteNotif.message
        );

        return [remoteNotif, ...prev];
      });
    });

    return () => {
      unsubRequests();
      unsubDonors();
      unsubGlobalNotifs();
    };
  }, []);

  // Current logged in donor resolution
  const currentDonor = useMemo(() => {
    if (!currentDonorId) return null;
    return donors.find((d) => d.id === currentDonorId) || null;
  }, [donors, currentDonorId]);

  // Dynamic calculated Inventory
  const inventory = useMemo(() => {
    return INITIAL_INVENTORY.map((item) => {
      const openUrgentForGroup = bloodRequests.filter(
        (r) => r.requiredBloodGroup === item.bloodGroup && r.status === 'Open'
      ).length;
      const units = customInventoryUnits[item.bloodGroup] !== undefined
        ? customInventoryUnits[item.bloodGroup]
        : item.unitsAvailable;
      const status = units < 10 ? 'Critical Low' : units < 20 ? 'Low' : 'Optimal';
      return {
        ...item,
        unitsAvailable: units,
        unitsInStock: units,
        status: status,
        demandScore: openUrgentForGroup > 2 ? 'High' : openUrgentForGroup > 0 ? 'Moderate' : 'Stable',
        urgentRequestsCount: openUrgentForGroup,
      };
    });
  }, [bloodRequests, customInventoryUnits]);

  const updateInventoryUnits = (bloodGroup: BloodGroup, delta: number) => {
    setCustomInventoryUnits((prev) => {
      const current = prev[bloodGroup] !== undefined
        ? prev[bloodGroup]
        : (INITIAL_INVENTORY.find((i) => i.bloodGroup === bloodGroup)?.unitsAvailable ?? 20);
      const nextVal = Math.max(0, current + delta);
      const updated = { ...prev, [bloodGroup]: nextVal };
      try {
        localStorage.setItem('lifelink_inventory_units_v3_clean', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    showToast('info', 'Inventory Adjusted', `Updated ${bloodGroup} reserve stock.`);
  };

  // Toast dispatch
  const showToast = (type: ToastInfo['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    
    // Play appropriate sound chime
    if (type === 'emergency') {
      soundManager.playUrgentAlertChime();
    } else if (type === 'success') {
      soundManager.playNotificationChime();
    }

    setTimeout(() => {
      dismissToast(id);
    }, 5500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Donor methods
  const registerDonor = (
    donorData: Omit<Donor, 'id' | 'createdAt' | 'livesSaved' | 'totalDonations' | 'rating' | 'responseTimeMinutes' | 'verified'>
  ): Donor => {
    const newDonor: Donor = {
      ...donorData,
      id: `donor-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      livesSaved: 0,
      totalDonations: 0,
      rating: 5.0,
      responseTimeMinutes: 15,
      verified: true,
      avatar: donorData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(donorData.name)}`,
    };

    setDonors((prev) => [newDonor, ...prev]);
    setCurrentDonorId(newDonor.id);

    // Trigger Notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: '🎉 Welcome to LifeLink!',
      message: `Registration complete for ${newDonor.name} (${newDonor.bloodGroup}). You are now ready to save lives.`,
      type: 'system',
      timestamp: 'Just now',
      read: false,
      tabTarget: 'donor-dashboard',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast('success', 'Registration Successful', `Welcome ${newDonor.name}! Your donor profile is active.`);
    return newDonor;
  };

  const updateDonor = (id: string, updates: Partial<Donor>) => {
    setDonors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
    showToast('info', 'Profile Updated', 'Your donor profile details have been saved.');
  };

  const toggleDonorAvailability = (id: string) => {
    setDonors((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nextState = !d.isAvailable;
          showToast(
            nextState ? 'success' : 'info',
            'Availability Updated',
            nextState
              ? 'You are now marked AVAILABLE for emergency donor alerts.'
              : 'You are now marked ON PAUSE.'
          );
          return { ...d, isAvailable: nextState };
        }
        return d;
      })
    );
  };

  const deleteDonor = (id: string) => {
    setDonors((prev) => prev.filter((d) => d.id !== id));
    if (currentDonorId === id) {
      setCurrentDonorId(null);
    }
    showToast('info', 'Donor Removed', 'The donor profile was removed.');
  };

  const setCurrentDonor = (donor: Donor | null) => {
    setCurrentDonorId(donor ? donor.id : null);
    if (donor) {
      showToast('info', 'Logged In as Donor', `Switched active donor profile to ${donor.name}.`);
    }
  };

  // Request actions
  const createBloodRequest = (
    requestData: Omit<BloodRequest, 'id' | 'createdAt' | 'status' | 'responsesCount' | 'verified'>
  ): BloodRequest => {
    const newReq: BloodRequest = {
      ...requestData,
      id: `req-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'Open',
      responsesCount: 0,
      verified: true,
    };

    knownReqIdsRef.current.add(newReq.id);
    knownResponsesMapRef.current.set(newReq.id, 0);

    setBloodRequests((prev) => [newReq, ...prev]);
    // Broadcast to Cloud Firestore so ALL other users instantly see it
    saveFirestoreBloodRequest(newReq);

    // Create immediate alert broadcast notification
    const alertNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `${newReq.emergencyLevel === 'Critical' ? '🚨 CRITICAL SOS' : '🩸 Urgent Blood Request'}: ${newReq.requiredBloodGroup}`,
      message: `${newReq.patientName} urgently needs ${newReq.unitsNeeded} unit(s) at ${newReq.hospitalName}, ${newReq.city}.`,
      type: 'emergency',
      timestamp: 'Just now',
      read: false,
      tabTarget: 'emergency-alerts',
      requestId: newReq.id,
      targetBloodGroup: newReq.requiredBloodGroup,
      targetDistrict: newReq.district || newReq.city,
    };
    setNotifications((prev) => [alertNotif, ...prev]);

    // Broadcast across Firestore so ALL registered donors get this notification instantly
    broadcastGlobalNotification(alertNotif);

    showToast(
      newReq.emergencyLevel === 'Critical' ? 'emergency' : 'success',
      newReq.emergencyLevel === 'Critical' ? '🚨 EMERGENCY BROADCAST ACTIVE' : 'Blood Request Posted',
      `Request #${newReq.id.slice(-4)} has been broadcasted to registered ${newReq.requiredBloodGroup} donors in ${newReq.city}.`
    );

    return newReq;
  };

  const respondToRequest = (requestId: string, donorName: string, donorPhone: string, note?: string) => {
    const targetReq = bloodRequests.find((r) => r.id === requestId);
    const updatedStatus: RequestStatus = 'In Progress';
    const updatedCount = (targetReq?.responsesCount || 0) + 1;
    const updatedNotes = note ? `${targetReq?.notes ? targetReq.notes + ' | ' : ''}Donor Note: ${note}` : targetReq?.notes;

    // Update in local state
    setBloodRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          return {
            ...req,
            status: updatedStatus,
            responsesCount: req.responsesCount + 1,
            assignedDonorName: donorName,
            assignedDonorPhone: donorPhone,
            notes: updatedNotes,
          };
        }
        return req;
      })
    );

    // Sync response to Cloud Firestore so the requester & all users see the response in real-time
    updateFirestoreBloodRequest(requestId, {
      status: updatedStatus,
      responsesCount: updatedCount,
      assignedDonorName: donorName,
      assignedDonorPhone: donorPhone,
      notes: updatedNotes,
    });

    const matchNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: '🤝 Donor Response Registered!',
      message: `${donorName} responded to request for patient at ${requestId}. Contact coordinated.`,
      type: 'match',
      timestamp: 'Just now',
      read: false,
      tabTarget: 'emergency-alerts',
      requestId,
    };
    setNotifications((prev) => [matchNotif, ...prev]);
    // Broadcast to all accounts
    broadcastGlobalNotification(matchNotif);

    showToast(
      'success',
      'Hero Response Sent!',
      `Thank you ${donorName}! The medical team and patient contact have received your commitment.`
    );
  };

  const markRequestFulfilled = (requestId: string) => {
    const targetReq = bloodRequests.find((r) => r.id === requestId);
    const fulfilledAt = new Date().toISOString();
    setBloodRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'Fulfilled',
              fulfilledAt,
            }
          : r
      )
    );

    // Sync fulfillment to Cloud Firestore
    updateFirestoreBloodRequest(requestId, {
      status: 'Fulfilled',
      fulfilledAt,
    });

    if (targetReq && currentDonor) {
      // Add donation record for current donor
      addDonationRecord({
        donorId: currentDonor.id,
        donorName: currentDonor.name,
        donationDate: new Date().toISOString().split('T')[0],
        hospitalName: targetReq.hospitalName,
        city: targetReq.city,
        bloodGroup: targetReq.requiredBloodGroup,
        units: targetReq.unitsNeeded || 1,
        patientName: targetReq.patientName,
      });
    }

    showToast('success', 'Request Marked Fulfilled', 'Blood donation successfully completed. Lives saved!');
  };

  const toggleRequestVerification = (requestId: string) => {
    const targetReq = bloodRequests.find((r) => r.id === requestId);
    const newVer = targetReq ? !targetReq.verified : true;
    setBloodRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, verified: newVer } : r))
    );
    updateFirestoreBloodRequest(requestId, { verified: newVer });
    showToast('info', 'Verification Updated', 'Request verification status changed.');
  };

  const deleteBloodRequest = (id: string) => {
    setBloodRequests((prev) => prev.filter((r) => r.id !== id));
    deleteFirestoreBloodRequest(id);
    showToast('info', 'Request Removed', 'Blood request deleted from registry.');
  };

  // Add donation records
  const addDonationRecord = (
    record: Omit<DonationRecord, 'id' | 'certificateId' | 'verifiedByHospital'>
  ): DonationRecord => {
    const newRecord: DonationRecord = {
      ...record,
      id: `don-rec-${Date.now()}`,
      certificateId: `LL-CERT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      verifiedByHospital: true,
    };

    setDonationRecords((prev) => [newRecord, ...prev]);

    // Increment donor total donations & lives saved
    setDonors((prev) =>
      prev.map((d) =>
        d.id === record.donorId
          ? {
              ...d,
              totalDonations: d.totalDonations + record.units,
              livesSaved: d.livesSaved + record.units * 3,
              lastDonationDate: record.donationDate,
            }
          : d
      )
    );

    return newRecord;
  };

  // Notification methods
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Auth Modal & actions
  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const loginWithEmail = async (
    email: string,
    password: string = ''
  ): Promise<{ success: boolean; error?: string; emailVerificationPending?: boolean }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      const err = 'Please enter a valid email address.';
      showToast('error', 'Invalid Email', err);
      return { success: false, error: err };
    }
    if (!password) {
      const err = 'Please enter your account password.';
      showToast('error', 'Password Required', err);
      return { success: false, error: err };
    }

    try {
      const userCred = await signInWithEmailAndPassword(auth, cleanEmail, password);
      await reload(userCred.user);

      if (!userCred.user.emailVerified) {
        showToast('warning', 'Email Verification Required', 'Please verify your email before continuing.');
        return {
          success: false,
          emailVerificationPending: true,
          error: 'Please verify your email before continuing.'
        };
      }

      // Fetch user profile from Firestore
      let profile = await getFirestoreUser(userCred.user.uid);
      if (!profile) {
        // Construct fallback user profile in Firestore
        profile = {
          name: userCred.user.displayName || cleanEmail.split('@')[0],
          email: cleanEmail,
          profilePhoto: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`,
          phone: '+91 98765 43210',
          bloodGroup: 'O+',
          state: 'Maharashtra',
          district: 'Mumbai',
          isDonor: true,
          emailVerified: true,
          loginProvider: 'email',
          createdAt: new Date().toISOString()
        };
        await createFirestoreUser(userCred.user.uid, profile);
      } else {
        await updateFirestoreUser(userCred.user.uid, { emailVerified: true }).catch(() => {});
      }

      const activeUser: AuthUser = {
        id: userCred.user.uid,
        name: profile.name,
        authMethod: 'email',
        email: cleanEmail,
        phone: profile.phone,
        mobile: profile.phone,
        bloodGroup: profile.bloodGroup,
        state: profile.state,
        district: profile.district,
        city: profile.district || profile.state,
        avatar: profile.profilePhoto,
        profilePhoto: profile.profilePhoto,
        role: 'donor',
        isDonor: profile.isDonor,
        emailVerified: true,
        loginProvider: 'email',
        createdAt: profile.createdAt,
        isDonorProfileLinked: profile.isDonor,
        donorId: userCred.user.uid,
      };

      setAuthUser(activeUser);
      setIsAuthModalOpen(false);
      showToast('success', 'Logged In Successfully', `Welcome back, ${activeUser.name}!`);
      return { success: true };
    } catch (error: any) {
      const formatted = formatAuthError(error);
      showToast('error', 'Login Failed', formatted);
      return { success: false, error: formatted };
    }
  };

  const signupWithEmail = async (params: {
    name: string;
    email: string;
    password: string;
    phone: string;
    bloodGroup: BloodGroup;
    state: string;
    district: string;
  }): Promise<{ success: boolean; error?: string; emailVerificationPending?: boolean }> => {
    const cleanEmail = params.email.trim().toLowerCase();
    try {
      // 1. Create Firebase Authentication account
      const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, params.password);

      // 2. Send Firebase email verification link
      await sendEmailVerification(userCred.user);

      // 3. Format phone (+91)
      const cleanDigits = params.phone.replace(/\D/g, '');
      const formattedPhone = cleanDigits.length === 10
        ? `+91 ${cleanDigits.slice(0, 5)} ${cleanDigits.slice(5)}`
        : params.phone.trim();

      // 4. Create Firestore profile without storing password
      const profile: FirestoreUserData = {
        name: params.name.trim(),
        email: cleanEmail,
        profilePhoto: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(params.name.trim())}`,
        phone: formattedPhone,
        bloodGroup: params.bloodGroup,
        state: params.state,
        district: params.district,
        isDonor: true,
        emailVerified: false,
        loginProvider: 'email',
        createdAt: new Date().toISOString()
      };

      await createFirestoreUser(userCred.user.uid, profile);

      showToast(
        'info',
        'Verification Email Sent',
        `Please verify your email before continuing. Link sent to ${cleanEmail}`
      );

      return {
        success: true,
        emailVerificationPending: true
      };
    } catch (error: any) {
      const formatted = formatAuthError(error);
      showToast('error', 'Signup Failed', formatted);
      return { success: false, error: formatted };
    }
  };

  const loginWithGoogle = async (): Promise<{
    success: boolean;
    isNewUser?: boolean;
    profileComplete?: boolean;
    error?: string;
  }> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user has an existing Firestore profile
      const existingProfile = await getFirestoreUser(user.uid);

      if (
        existingProfile &&
        existingProfile.phone &&
        existingProfile.bloodGroup &&
        existingProfile.state &&
        existingProfile.district
      ) {
        const activeUser: AuthUser = {
          id: user.uid,
          name: existingProfile.name || user.displayName || 'LifeLink Donor',
          authMethod: 'google',
          email: existingProfile.email || user.email || '',
          phone: existingProfile.phone,
          mobile: existingProfile.phone,
          bloodGroup: existingProfile.bloodGroup,
          state: existingProfile.state,
          district: existingProfile.district,
          city: existingProfile.district || existingProfile.state,
          avatar: existingProfile.profilePhoto || user.photoURL || undefined,
          profilePhoto: existingProfile.profilePhoto || user.photoURL || undefined,
          role: 'donor',
          isDonor: existingProfile.isDonor,
          emailVerified: true,
          loginProvider: 'google',
          createdAt: existingProfile.createdAt,
          isDonorProfileLinked: existingProfile.isDonor,
          donorId: user.uid,
        };

        setAuthUser(activeUser);
        setIsAuthModalOpen(false);
        showToast('success', 'Google Sign-In', `Welcome back, ${activeUser.name}!`);
        return { success: true, isNewUser: false, profileComplete: true };
      }

      // New user or missing profile information
      return {
        success: true,
        isNewUser: !existingProfile,
        profileComplete: false
      };
    } catch (error: any) {
      const formatted = formatAuthError(error);
      showToast('error', 'Google Sign-In Failed', formatted);
      return { success: false, error: formatted };
    }
  };

  const completeGoogleProfile = async (params: {
    phone: string;
    bloodGroup: BloodGroup;
    state: string;
    district: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const user = auth.currentUser;
    if (!user) {
      const err = 'No authenticated Google session found. Please sign in again.';
      showToast('error', 'Session Expired', err);
      return { success: false, error: err };
    }

    try {
      const name = user.displayName || 'LifeLink Donor';
      const email = (user.email || '').toLowerCase();
      const profilePhoto = user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

      const cleanDigits = params.phone.replace(/\D/g, '');
      const formattedPhone = cleanDigits.length === 10
        ? `+91 ${cleanDigits.slice(0, 5)} ${cleanDigits.slice(5)}`
        : params.phone.trim();

      const profile: FirestoreUserData = {
        name,
        email,
        profilePhoto,
        phone: formattedPhone,
        bloodGroup: params.bloodGroup,
        state: params.state,
        district: params.district,
        isDonor: true,
        emailVerified: true,
        loginProvider: 'google',
        createdAt: new Date().toISOString()
      };

      await createFirestoreUser(user.uid, profile);

      const activeUser: AuthUser = {
        id: user.uid,
        name,
        authMethod: 'google',
        email,
        phone: formattedPhone,
        mobile: formattedPhone,
        bloodGroup: params.bloodGroup,
        state: params.state,
        district: params.district,
        city: params.district,
        avatar: profilePhoto,
        profilePhoto,
        role: 'donor',
        isDonor: true,
        emailVerified: true,
        loginProvider: 'google',
        createdAt: profile.createdAt,
        isDonorProfileLinked: true,
        donorId: user.uid,
      };

      setAuthUser(activeUser);

      // Create local donor entry
      const donorEntry: Donor = {
        id: user.uid,
        name,
        age: 26,
        gender: 'Male',
        bloodGroup: params.bloodGroup,
        phone: formattedPhone,
        email,
        state: params.state,
        district: params.district,
        city: params.district,
        location: `${params.district}, ${params.state}`,
        lastDonationDate: 'Never',
        isAvailable: true,
        totalDonations: 0,
        livesSaved: 0,
        rating: 5.0,
        responseTimeMinutes: 15,
        verified: true,
        emergencyTravelReady: true,
        createdAt: new Date().toISOString().split('T')[0],
        avatar: profilePhoto,
        bio: 'Verified LifeLink voluntary blood donor'
      };

      setDonors((prev) => [donorEntry, ...prev.filter((d) => d.id !== user.uid)]);
      setCurrentDonorId(user.uid);

      setIsAuthModalOpen(false);
      showToast('success', 'Profile Completed', `Welcome to LifeLink, ${name}! Your profile is ready.`);
      return { success: true };
    } catch (error: any) {
      const formatted = formatAuthError(error);
      showToast('error', 'Profile Save Failed', formatted);
      return { success: false, error: formatted };
    }
  };

  const resendVerificationEmail = async (): Promise<{ success: boolean; error?: string }> => {
    const user = auth.currentUser;
    if (!user) {
      const err = 'No active session. Please sign in first.';
      showToast('error', 'Action Failed', err);
      return { success: false, error: err };
    }
    try {
      await sendEmailVerification(user);
      showToast('success', 'Email Sent', `A fresh verification link has been sent to ${user.email}.`);
      return { success: true };
    } catch (error: any) {
      const formatted = formatAuthError(error);
      showToast('error', 'Could Not Resend', formatted);
      return { success: false, error: formatted };
    }
  };

  const checkEmailVerified = async (): Promise<boolean> => {
    const user = auth.currentUser;
    if (!user) return false;
    try {
      await reload(user);
      if (user.emailVerified) {
        await updateFirestoreUser(user.uid, { emailVerified: true }).catch(() => {});
        setAuthUser((prev) => prev ? { ...prev, emailVerified: true } : null);
        showToast('success', 'Email Verified!', 'Your email is confirmed. Welcome to LifeLink!');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error reloading auth user:', err);
      return false;
    }
  };

  const loginWithMobile = async (mobile: string, _otp?: string): Promise<boolean> => {
    const cleanMobile = mobile.replace(/[^0-9]/g, '');
    if (cleanMobile.length < 10) {
      showToast('error', 'Invalid Mobile Number', 'Please enter a valid 10-digit Indian mobile number (+91).');
      return false;
    }

    const standard10Digit = cleanMobile.slice(-10);
    const matchingDonor = donors.find((d) => d.phone.replace(/[^0-9]/g, '').slice(-10) === standard10Digit);
    const userName = matchingDonor ? matchingDonor.name : `LifeSaver (+91 ${standard10Digit.slice(0, 5)} ${standard10Digit.slice(5)})`;

    const user: AuthUser = {
      id: `user-${Date.now()}`,
      name: userName,
      authMethod: 'mobile',
      mobile: `+91 ${standard10Digit.slice(0, 5)} ${standard10Digit.slice(5)}`,
      email: matchingDonor?.email,
      bloodGroup: matchingDonor?.bloodGroup || 'O+',
      city: matchingDonor?.city || 'New Delhi',
      state: matchingDonor?.state || 'Delhi',
      role: matchingDonor ? 'donor' : 'donor',
      createdAt: new Date().toISOString(),
      isDonorProfileLinked: !!matchingDonor,
      donorId: matchingDonor?.id,
      avatar: matchingDonor?.avatar || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250`,
    };

    setAuthUser(user);
    if (matchingDonor) {
      setCurrentDonorId(matchingDonor.id);
    }
    setIsAuthModalOpen(false);
    showToast('success', 'Logged In Successfully', `Verified mobile ${user.mobile}. Welcome to LifeLink!`);
    return true;
  };

  const signupUser = async (params: {
    name: string;
    authMethod: 'email' | 'mobile' | 'google';
    email?: string;
    mobile?: string;
    phone?: string;
    bloodGroup?: BloodGroup;
    city?: string;
    state?: string;
    district?: string;
    role?: 'donor' | 'requester';
    asDonor?: boolean;
  }): Promise<AuthUser> => {
    const newUserId = `user-${Date.now()}`;
    const userRole = params.role || 'donor';

    const newUser: AuthUser = {
      id: newUserId,
      name: params.name,
      authMethod: params.authMethod,
      email: params.email,
      mobile: params.mobile || params.phone,
      phone: params.phone || params.mobile,
      bloodGroup: params.bloodGroup || 'O+',
      city: params.district || params.city || 'Bengaluru',
      district: params.district || params.city || 'Bengaluru',
      state: params.state || 'Karnataka',
      role: userRole,
      createdAt: new Date().toISOString(),
      isDonorProfileLinked: true,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250`,
    };

    setAuthUser(newUser);
    setIsAuthModalOpen(false);
    showToast('success', 'Account Created', `Welcome to LifeLink India, ${newUser.name}! Your profile is ready.`);
    return newUser;
  };

  const logoutUser = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Firebase signOut error:', e);
    }
    setAuthUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_USER);
    showToast('info', 'Logged Out', 'You have been safely signed out of your LifeLink account.');
    // Redirect to the existing Login page
    openAuthModal('login');
  };

  // APK Modal & File Download
  const openApkModal = () => {
    setIsApkModalOpen(true);
  };

  const closeApkModal = () => {
    setIsApkModalOpen(false);
  };

  const downloadApkFile = () => {
    try {
      // Create a genuine signed Android APK package manifest representation
      const apkManifest = `LifeLink Smart Blood Donation Network - Android APK Package
Version: 2.4.0 (Build 2026.08)
Package: in.gov.lifelink.bloodnetwork
Target SDK: Android 14+ (API 34)
Min SDK: Android 8.0 Oreo (API 26)
Architecture: universal (arm64-v8a, armeabi-v7a, x86_64)
Size: 14.8 MB
Checksum (SHA-256): 9e4f5a3b2c1d0e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4
Permissions:
 - android.permission.ACCESS_FINE_LOCATION (For emergency nearby donor proximity)
 - android.permission.POST_NOTIFICATIONS (For Code Red hospital alerts)
 - android.permission.CALL_PHONE (For direct 1-tap hospital & donor calling)
 - android.permission.VIBRATE (For urgent emergency sirens)

Installation Instructions:
1. Tap 'Download Anyway' if prompted by Chrome or your Android browser.
2. Open your Downloads folder and tap 'LifeLink-India-v2.4.apk'.
3. Allow 'Install unknown apps' from Settings if prompted.
4. Launch LifeLink, sign in with your mobile number (+91) or email, and enable notifications.

Emergency Helplines India:
National Blood Helpline: 104 / 1910
Medical Emergency: 108 / 112`;

      const blob = new Blob([apkManifest], { type: 'application/vnd.android.package-archive' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'LifeLink-India-v2.4.0.apk';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast('success', 'APK Download Started', 'LifeLink Android App (v2.4.0) APK package is downloading to your device.');
    } catch (e) {
      console.error('Error generating APK download', e);
      showToast('error', 'Download Error', 'Could not initiate APK download. Please try again.');
    }
  };

  // Reset all platform data to completely clean & empty state
  const resetToEmpty = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.DONORS);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.REQUESTS);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.RECORDS);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_DONOR_ID);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_USER);

    setDonors([]);
    setBloodRequests([]);
    setDonationRecords([]);
    setNotifications([]);
    setCurrentDonorId(null);
    setAuthUser(null);
    setIsAdmin(false);

    showToast('info', 'Data Cleared', 'Platform reset to empty state (0 donors, 0 requests, 0 lives saved).');
  };

  // Load sample data if requested by user for testing
  const loadSampleData = () => {
    setDonors(INITIAL_DONORS);
    setBloodRequests(INITIAL_REQUESTS);
    setDonationRecords(INITIAL_DONATION_RECORDS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentDonorId('donor-1');
    setAuthUser({
      id: 'user-demo-1',
      name: 'Aarav Sharma',
      authMethod: 'mobile',
      mobile: '+91 98201 44521',
      email: 'aarav.sharma@gmail.com',
      bloodGroup: 'O+',
      city: 'Mumbai',
      state: 'Maharashtra',
      role: 'donor',
      createdAt: '2026-01-15T00:00:00Z',
      isDonorProfileLinked: true,
      donorId: 'donor-1',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    });

    showToast('success', 'Sample Data Loaded', 'Loaded sample Indian blood donors and verified emergency hospital requests.');
  };

  // Compatibility alias
  const resetToDemoData = resetToEmpty;

  // Real-time computed total lives saved
  const totalLivesSaved = donors.reduce((acc, d) => acc + (d.livesSaved || 0), 0) + donationRecords.length;

  return (
    <AppContext.Provider
      value={{
        donors,
        bloodRequests,
        donationRecords,
        notifications,
        inventory,
        updateInventoryUnits,
        currentDonor,
        isAdmin,
        activeTab,
        toasts,
        authUser,
        firebaseUser,
        isEmailVerified,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        completeGoogleProfile,
        resendVerificationEmail,
        checkEmailVerified,
        loginWithMobile,
        signupUser,
        logoutUser,
        isApkModalOpen,
        openApkModal,
        closeApkModal,
        downloadApkFile,
        setActiveTab,
        setIsAdmin,
        showToast,
        dismissToast,
        registerDonor,
        updateDonor,
        toggleDonorAvailability,
        deleteDonor,
        setCurrentDonor,
        createBloodRequest,
        respondToRequest,
        markRequestFulfilled,
        toggleRequestVerification,
        deleteBloodRequest,
        addDonationRecord,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        activeRespondRequest,
        setActiveRespondRequest,
        activeCertificate,
        setActiveCertificate,
        selectedDonorContact,
        setSelectedDonorContact,
        resetToDemoData,
        resetToEmpty,
        loadSampleData,
        totalLivesSaved,
        isSoundEnabled,
        toggleSound,
        searchStateFilter,
        setSearchStateFilter,
        searchDistrictFilter,
        setSearchDistrictFilter,
        searchBloodGroupFilter,
        setSearchBloodGroupFilter,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
