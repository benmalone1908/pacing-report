import React from 'react';
import { Select } from '@/components/ui/select';
import type { ProcessedCampaign } from '@/types';

interface CampaignSelectorProps {
  campaigns: ProcessedCampaign[];
  selectedCampaign: string | null;
  onCampaignSelect: (campaignName: string) => void;
}

export const CampaignSelector: React.FC<CampaignSelectorProps> = ({
  campaigns,
  selectedCampaign,
  onCampaignSelect
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <label htmlFor="campaign-select" className="block text-2xl font-bold text-gray-800 mb-2">
          Select Campaign
        </label>
        <p className="text-gray-600">Choose a campaign to view its pacing report</p>
      </div>
      <div className="relative">
        <Select
          id="campaign-select"
          value={selectedCampaign || ''}
          onChange={(e) => onCampaignSelect(e.target.value)}
          className="w-full text-lg font-medium py-4 px-6 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-2xl shadow-lg hover:shadow-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
        >
          <option value="" className="text-gray-400">Choose a campaign...</option>
          {campaigns.map((campaign) => (
            <option key={campaign.name} value={campaign.name} className="text-gray-800 py-2">
              {campaign.name}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
};