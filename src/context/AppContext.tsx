import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Donor,
  BloodRequest,
  DonationRecord,
  AppNotification,
  NavigationTab,
  BloodInventoryItem,
  BloodGroup
} from '../types';
import {
  INITIAL_DONORS,
  INITIAL_REQUESTS,
  INITIAL_DONATION_RECORDS,
  INITIAL_NOTIFICATIONS,
  INITIAL_INVENTORY
} from '../data/mockData';

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
  currentDonor: Donor | null;
  isAdmin: boolean;
  activeTab: NavigationTab;
  toasts: ToastInfo[];
  
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
  simulateIncomingEmergency: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  DONORS: 'lifelink_donors_v1',
  REQUESTS: 'lifelink_requests_v1',
  RECORDS: 'lifelink_records_v1',
  NOTIFICATIONS: 'lifelink_notifications_v1',
  CURRENT_DONOR_ID: 'lifelink_current_donor_id_v1',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load state from localStorage or initialize from mock
  const [donors, setDonors] = useState<Donor[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.DONORS);
      return saved ? JSON.parse(saved) : INITIAL_DONORS;
    } catch {
      return INITIAL_DONORS;
    }
  });

  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.REQUESTS);
      return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
    } catch {
      return INITIAL_REQUESTS;
    }
  });

  const [donationRecords, setDonationRecords] = useState<DonationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.RECORDS);
      return saved ? JSON.parse(saved) : INITIAL_DONATION_RECORDS;
    } catch {
      return INITIAL_DONATION_RECORDS;
    }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [currentDonorId, setCurrentDonorId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_DONOR_ID) || 'donor-1';
    } catch {
      return 'donor-1';
    }
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Modals
  const [activeRespondRequest, setActiveRespondRequest] = useState<BloodRequest | null>(null);
  const [activeCertificate, setActiveCertificate] = useState<DonationRecord | null>(null);
  const [selectedDonorContact, setSelectedDonorContact] = useState<Donor | null>(null);

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
      return {
        ...item,
        urgentRequestsCount: openUrgentForGroup,
      };
    });
  }, [bloodRequests]);

  // Toast dispatch
  const showToast = (type: ToastInfo['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
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

    setBloodRequests((prev) => [newReq, ...prev]);

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
    };
    setNotifications((prev) => [alertNotif, ...prev]);

    showToast(
      newReq.emergencyLevel === 'Critical' ? 'emergency' : 'success',
      newReq.emergencyLevel === 'Critical' ? '🚨 EMERGENCY BROADCAST ACTIVE' : 'Blood Request Posted',
      `Request #${newReq.id.slice(-4)} has been broadcasted to registered ${newReq.requiredBloodGroup} donors in ${newReq.city}.`
    );

    return newReq;
  };

  const respondToRequest = (requestId: string, donorName: string, donorPhone: string, note?: string) => {
    setBloodRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          return {
            ...req,
            status: 'In Progress',
            responsesCount: req.responsesCount + 1,
            assignedDonorName: donorName,
            assignedDonorPhone: donorPhone,
            notes: note ? `${req.notes ? req.notes + ' | ' : ''}Donor Note: ${note}` : req.notes,
          };
        }
        return req;
      })
    );

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

    showToast(
      'success',
      'Hero Response Sent!',
      `Thank you ${donorName}! The medical team and patient contact have received your commitment.`
    );
  };

  const markRequestFulfilled = (requestId: string) => {
    const targetReq = bloodRequests.find((r) => r.id === requestId);
    setBloodRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'Fulfilled',
              fulfilledAt: new Date().toISOString(),
            }
          : r
      )
    );

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
    setBloodRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, verified: !r.verified } : r))
    );
    showToast('info', 'Verification Updated', 'Request verification status changed.');
  };

  const deleteBloodRequest = (id: string) => {
    setBloodRequests((prev) => prev.filter((r) => r.id !== id));
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

  // Reset to demo data
  const resetToDemoData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.DONORS);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.REQUESTS);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.RECORDS);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_DONOR_ID);

    setDonors(INITIAL_DONORS);
    setBloodRequests(INITIAL_REQUESTS);
    setDonationRecords(INITIAL_DONATION_RECORDS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentDonorId('donor-1');
    setIsAdmin(false);

    showToast('info', 'Demo Data Reset', 'Platform restored to initial realistic healthcare simulation dataset.');
  };

  // Simulator helper
  const simulateIncomingEmergency = () => {
    const bloodTypes: BloodGroup[] = ['O-', 'B-', 'AB-', 'O+', 'A+'];
    const selectedGroup = bloodTypes[Math.floor(Math.random() * bloodTypes.length)];
    const hospitals = [
      { name: 'Bellevue Trauma Hospital', city: 'New York' },
      { name: 'Rush University Medical Center', city: 'Chicago' },
      { name: 'Memorial Hermann Trauma Center', city: 'Houston' },
      { name: 'Keck Hospital of USC', city: 'Los Angeles' }
    ];
    const pickedHosp = hospitals[Math.floor(Math.random() * hospitals.length)];

    const simReq = createBloodRequest({
      patientName: `Emergency Patient #${Math.floor(100 + Math.random() * 900)}`,
      requiredBloodGroup: selectedGroup,
      unitsNeeded: Math.floor(1 + Math.random() * 3),
      hospitalName: pickedHosp.name,
      location: `Emergency Wing, ${pickedHosp.city}`,
      city: pickedHosp.city,
      contactNumber: `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      requiredDate: 'Within 2 Hours',
      emergencyLevel: 'Critical',
      reason: 'Sudden massive trauma transfusion required. Priority Level 1 Code Red.',
      requesterName: 'Trauma Director on Call',
    });

    setActiveTab('emergency-alerts');
  };

  return (
    <AppContext.Provider
      value={{
        donors,
        bloodRequests,
        donationRecords,
        notifications,
        inventory,
        currentDonor,
        isAdmin,
        activeTab,
        toasts,
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
        simulateIncomingEmergency,
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
