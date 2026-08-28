import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BloodGroup, EmergencyLevel, RequestStatus, Donor, BloodRequest } from '../types';
import {
  ShieldAlert,
  Users,
  Droplet,
  Siren,
  Hospital,
  Search,
  CheckCircle2,
  Trash2,
  Download,
  Filter,
  Check,
  X,
  Plus,
  RefreshCw,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Database
} from 'lucide-react';
import { MAJOR_CITIES } from '../data/mockData';

export const AdminDashboardView: React.FC = () => {
  const {
    donors,
    bloodRequests,
    inventory,
    toggleDonorAvailability,
    deleteDonor,
    updateDonor,
    markRequestFulfilled,
    deleteBloodRequest,
    simulateIncomingEmergency,
    showToast,
    updateInventoryUnits,
    setActiveRespondRequest,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'donors' | 'requests' | 'inventory'>('overview');
  const [donorSearch, setDonorSearch] = useState('');
  const [donorBloodFilter, setDonorBloodFilter] = useState<BloodGroup | 'All'>('All');
  const [requestSearch, setRequestSearch] = useState('');
  const [requestLevelFilter, setRequestLevelFilter] = useState<EmergencyLevel | 'All'>('All');

  // Computed summary metrics
  const totalDonors = donors.length;
  const availableDonors = donors.filter((d) => d.isAvailable).length;
  const totalRequests = bloodRequests.length;
  const openRequests = bloodRequests.filter((r) => r.status === 'Open').length;
  const criticalRequests = bloodRequests.filter((r) => r.emergencyLevel === 'Critical' && r.status === 'Open').length;
  const totalUnitsInStock = inventory.reduce((acc, curr) => acc + curr.unitsInStock, 0);

  // Filtered Donors Table
  const filteredDonors = donors.filter((d) => {
    if (donorBloodFilter !== 'All' && d.bloodGroup !== donorBloodFilter) return false;
    if (donorSearch.trim()) {
      const q = donorSearch.toLowerCase();
      return (
        d.name.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q) ||
        d.email.toLowerCase().includes(q) ||
        d.phone.includes(q)
      );
    }
    return true;
  });

  // Filtered Requests Table
  const filteredRequests = bloodRequests.filter((r) => {
    if (requestLevelFilter !== 'All' && r.emergencyLevel !== requestLevelFilter) return false;
    if (requestSearch.trim()) {
      const q = requestSearch.toLowerCase();
      return (
        r.patientName.toLowerCase().includes(q) ||
        r.hospitalName.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        r.contactNumber.includes(q)
      );
    }
    return true;
  });

  const handleExportJSON = () => {
    const data = {
      exportTimestamp: new Date().toISOString(),
      summary: {
        totalDonors,
        availableDonors,
        totalRequests,
        openRequests,
        totalUnitsInStock,
      },
      inventory,
      donors,
      bloodRequests,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lifelink-registry-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Registry Exported', 'Full hospital database downloaded successfully as JSON.');
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5" />
              Central Hospital & Blood Bank Administration
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-['Outfit',sans-serif]">
              LifeLink Command Center
            </h1>
            <p className="text-slate-400 text-sm">
              Real-time regional blood network telemetry, donor registry verification, and emergency dispatch control.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportJSON}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 shadow-sm transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Database (JSON)
            </button>

            <button
              onClick={simulateIncomingEmergency}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md shadow-red-500/30 transition-all flex items-center gap-2"
            >
              <Siren className="w-4 h-4" />
              Trigger Test SOS
            </button>
          </div>
        </div>

        {/* Top Metric Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Donors</span>
              <h3 className="text-3xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
                {totalDonors}
              </h3>
              <p className="text-xs text-emerald-600 font-semibold">{availableDonors} currently available</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-red-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Emergency Requests</span>
              <h3 className="text-3xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
                {totalRequests}
              </h3>
              <p className="text-xs text-red-600 font-semibold">{criticalRequests} Code Red Active</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Siren className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Blood Bank Inventory</span>
              <h3 className="text-3xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
                {totalUnitsInStock} <span className="text-sm font-normal text-slate-500">Units</span>
              </h3>
              <p className="text-xs text-slate-500">Across 8 blood groups</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <Droplet className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Regional Hospitals</span>
              <h3 className="text-3xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
                18
              </h3>
              <p className="text-xs text-emerald-600 font-semibold">100% Interconnected</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Hospital className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          {[
            { id: 'overview', label: 'Blood Reserves & Overview', icon: TrendingUp },
            { id: 'donors', label: `Manage Donors (${donors.length})`, icon: Users },
            { id: 'requests', label: `Manage Requests (${bloodRequests.length})`, icon: Siren },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2.5 px-4 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Blood Reserves / Inventory */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Regional Blood Reserve Inventory</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time units on hand. Click +/- to calibrate hospital stock during emergency intake.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-rose-600 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Low Reserve (&lt;15u)
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Optimal (&gt;20u)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {inventory.map((inv) => {
                  const isCritical = inv.status === 'Critical Low';
                  return (
                    <div
                      key={inv.bloodGroup}
                      className={`p-5 rounded-2xl border transition-all ${
                        isCritical
                          ? 'border-rose-300 bg-rose-50/40 ring-1 ring-rose-300'
                          : 'border-slate-200 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-black font-mono px-3 py-1 rounded-xl bg-red-600 text-white shadow-xs">
                          {inv.bloodGroup}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                            isCritical
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between mb-3">
                        <span className="text-3xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
                          {inv.unitsInStock} <span className="text-xs text-slate-500 font-normal">Units</span>
                        </span>
                        <span className="text-xs text-slate-400">Demand: {inv.demandScore}</span>
                      </div>

                      {/* Stock Adjustment Controls */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                        <span className="text-[11px] font-bold text-slate-500">Adjust Stock:</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateInventoryUnits(inv.bloodGroup, -1)}
                            className="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold flex items-center justify-center text-sm shadow-2xs"
                            title="Decrement 1 Unit"
                          >
                            -
                          </button>
                          <button
                            onClick={() => updateInventoryUnits(inv.bloodGroup, 1)}
                            className="w-7 h-7 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold flex items-center justify-center text-sm shadow-2xs"
                            title="Add 1 Unit"
                          >
                            +
                          </button>
                          <button
                            onClick={() => updateInventoryUnits(inv.bloodGroup, 5)}
                            className="px-2 h-7 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-2xs"
                            title="Add 5 Units Batch"
                          >
                            +5
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Manage Donors */}
        {activeTab === 'donors' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Registered Donors Directory</h3>
                <p className="text-xs text-slate-500">
                  Verify donor credentials, view contact information, and toggle active status.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={donorSearch}
                    onChange={(e) => setDonorSearch(e.target.value)}
                    placeholder="Search name, phone..."
                    className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <select
                  value={donorBloodFilter}
                  onChange={(e) => setDonorBloodFilter(e.target.value as any)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="All">All Blood Groups</option>
                  {(['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] as BloodGroup[]).map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-2">Donor</th>
                    <th className="py-3 px-2">Blood</th>
                    <th className="py-3 px-2">Location</th>
                    <th className="py-3 px-2">Contact</th>
                    <th className="py-3 px-2">Availability</th>
                    <th className="py-3 px-2">Verified</th>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDonors.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2.5">
                          <img src={d.avatar} alt={d.name} className="w-8 h-8 rounded-lg object-cover" />
                          <div>
                            <span className="font-bold text-slate-900 block">{d.name}</span>
                            <span className="text-[10px] text-slate-400">{d.age}y • {d.gender}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-2">
                        <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono font-bold text-xs">
                          {d.bloodGroup}
                        </span>
                      </td>

                      <td className="py-3 px-2 text-slate-600">
                        {d.location}, {d.city}
                      </td>

                      <td className="py-3 px-2">
                        <span className="block font-mono text-slate-800">{d.phone}</span>
                        <span className="text-[10px] text-slate-400">{d.email}</span>
                      </td>

                      <td className="py-3 px-2">
                        <button
                          onClick={() => toggleDonorAvailability(d.id)}
                          className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                            d.isAvailable
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {d.isAvailable ? '● Available' : '○ Paused'}
                        </button>
                      </td>

                      <td className="py-3 px-2">
                        <button
                          onClick={() => updateDonor(d.id, { verified: !d.verified })}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                            d.verified
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {d.verified ? '✓ Verified' : '+ Verify'}
                        </button>
                      </td>

                      <td className="py-3 px-2 text-right">
                        <button
                          onClick={() => deleteDonor(d.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete donor"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Manage Blood Requests */}
        {activeTab === 'requests' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Hospital Emergency Blood Requests</h3>
                <p className="text-xs text-slate-500">
                  Manage active broadcast alerts, mark transfusions fulfilled, and audit response logs.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={requestSearch}
                    onChange={(e) => setRequestSearch(e.target.value)}
                    placeholder="Search patient, hospital..."
                    className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <select
                  value={requestLevelFilter}
                  onChange={(e) => setRequestLevelFilter(e.target.value as any)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="All">All Priority Levels</option>
                  <option value="Critical">Critical Code Red</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Normal">Normal</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-2">Patient</th>
                    <th className="py-3 px-2">Blood Needed</th>
                    <th className="py-3 px-2">Hospital</th>
                    <th className="py-3 px-2">Priority</th>
                    <th className="py-3 px-2">Contact</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRequests.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-2">
                        <span className="font-bold text-slate-900 block">{r.patientName}</span>
                        <span className="text-[10px] text-slate-400">Req: {r.requesterName}</span>
                      </td>

                      <td className="py-3 px-2">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono font-bold text-xs">
                            {r.requiredBloodGroup}
                          </span>
                          <span className="font-semibold text-slate-700">{r.unitsNeeded}u</span>
                        </div>
                      </td>

                      <td className="py-3 px-2 text-slate-700">
                        <span className="block font-medium">{r.hospitalName}</span>
                        <span className="text-[10px] text-slate-400">{r.location || r.city}</span>
                      </td>

                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            r.emergencyLevel === 'Critical'
                              ? 'bg-red-100 text-red-700'
                              : r.emergencyLevel === 'Urgent'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {r.emergencyLevel}
                        </span>
                      </td>

                      <td className="py-3 px-2 font-mono text-slate-700">
                        {r.contactNumber}
                      </td>

                      <td className="py-3 px-2">
                        {r.status === 'Open' ? (
                          <button
                            onClick={() => markRequestFulfilled(r.id)}
                            className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 hover:bg-emerald-100 hover:text-emerald-900 font-bold text-[10px] transition-colors"
                          >
                            Mark Fulfilled
                          </button>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            ✓ Fulfilled
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-2 text-right">
                        <button
                          onClick={() => deleteBloodRequest(r.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete request"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
