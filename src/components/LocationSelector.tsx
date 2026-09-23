import React from 'react';
import { MapPin, Building2, ChevronDown } from 'lucide-react';
import { INDIAN_STATES_AND_UTS, getDistrictsForState } from '../data/indiaLocations';

export interface LocationSelectorProps {
  selectedState: string;
  selectedDistrict: string;
  onStateChange: (state: string) => void;
  onDistrictChange: (district: string) => void;
  stateLabel?: string;
  districtLabel?: string;
  statePlaceholder?: string;
  districtPlaceholder?: string;
  stateRequired?: boolean;
  districtRequired?: boolean;
  stateId?: string;
  districtId?: string;
  containerClassName?: string;
  stateContainerClassName?: string;
  districtContainerClassName?: string;
  showAllStatesOption?: boolean;
  showAllDistrictsOption?: boolean;
  allStatesLabel?: string;
  allDistrictsLabel?: string;
  disabled?: boolean;
  isCompact?: boolean;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedState,
  selectedDistrict,
  onStateChange,
  onDistrictChange,
  stateLabel = 'State / Union Territory',
  districtLabel = 'District',
  statePlaceholder = 'Select State / UT',
  districtPlaceholder = 'Select District',
  stateRequired = false,
  districtRequired = false,
  stateId = 'location-state',
  districtId = 'location-district',
  containerClassName = 'grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4',
  stateContainerClassName = '',
  districtContainerClassName = '',
  showAllStatesOption = false,
  showAllDistrictsOption = false,
  allStatesLabel = 'All States / UTs',
  allDistrictsLabel = 'All Districts',
  disabled = false,
  isCompact = false,
}) => {
  const availableDistricts = selectedState ? getDistrictsForState(selectedState) : [];
  const isDistrictDisabled = disabled || !selectedState;

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    onStateChange(newState);
    // Reset district selection whenever the state changes
    onDistrictChange('');
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onDistrictChange(e.target.value);
  };

  const selectHeight = isCompact ? 'h-10 text-xs' : 'h-11 text-sm';

  return (
    <div className={containerClassName}>
      {/* State / Union Territory Dropdown */}
      <div className={stateContainerClassName}>
        {stateLabel && (
          <label
            htmlFor={stateId}
            className="block text-xs font-semibold text-slate-700 mb-1.5 truncate"
          >
            {stateLabel} {stateRequired && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Building2 className="w-4 h-4" />
          </div>
          <select
            id={stateId}
            value={selectedState}
            onChange={handleStateChange}
            disabled={disabled}
            required={stateRequired}
            className={`w-full ${selectHeight} pl-10 pr-9 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all cursor-pointer appearance-none truncate ${
              disabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200' : ''
            }`}
          >
            <option value="">{statePlaceholder}</option>
            {showAllStatesOption && (
              <option value="ALL">{allStatesLabel}</option>
            )}
            {INDIAN_STATES_AND_UTS.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* District Dropdown (Dependent) */}
      <div className={districtContainerClassName}>
        {districtLabel && (
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor={districtId}
              className="block text-xs font-semibold text-slate-700 truncate"
            >
              {districtLabel} {districtRequired && <span className="text-red-500">*</span>}
            </label>
            {isDistrictDisabled && (
              <span className="text-[11px] text-slate-400 font-normal hidden sm:inline">
                Select State first
              </span>
            )}
          </div>
        )}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <MapPin className="w-4 h-4" />
          </div>
          <select
            id={districtId}
            value={selectedDistrict}
            onChange={handleDistrictChange}
            disabled={isDistrictDisabled}
            required={districtRequired && Boolean(selectedState)}
            className={`w-full ${selectHeight} pl-10 pr-9 rounded-xl border font-semibold transition-all appearance-none truncate ${
              isDistrictDisabled
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                : 'bg-white text-slate-800 border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:border-red-500 cursor-pointer shadow-2xs'
            }`}
          >
            <option value="">
              {isDistrictDisabled ? 'Select State / UT first' : districtPlaceholder}
            </option>
            {showAllDistrictsOption && Boolean(selectedState) && (
              <option value="ALL">{allDistrictsLabel}</option>
            )}
            {availableDistricts.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
