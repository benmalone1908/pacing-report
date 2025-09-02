import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import type { ProcessedCampaign } from '@/types';
import { Calendar, TrendingUp, TrendingDown, Target, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

interface CampaignOverviewTableProps {
  campaigns: ProcessedCampaign[];
  onCampaignClick: (campaign: ProcessedCampaign) => void;
}

type SortField = 'name' | 'daysInto' | 'daysUntil' | 'pacing' | 'yesterday';
type SortDirection = 'asc' | 'desc' | null;

const formatPercentage = (num: number): string => {
  return `${(num * 100).toFixed(1)}%`;
};

const getPacingColor = (pacing: number): string => {
  if (pacing >= 0.95 && pacing <= 1.05) return 'text-green-600';
  if (pacing >= 0.85 && pacing <= 1.15) return 'text-yellow-600';
  return 'text-red-600';
};

const getPacingIcon = (pacing: number) => {
  if (pacing > 1) return <TrendingUp className="h-4 w-4" />;
  return <TrendingDown className="h-4 w-4" />;
};

export const CampaignOverviewTable: React.FC<CampaignOverviewTableProps> = ({
  campaigns,
  onCampaignClick
}) => {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> null -> asc
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCampaigns = useMemo(() => {
    if (!sortField || !sortDirection) {
      return campaigns;
    }

    return [...campaigns].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'daysInto':
          aValue = a.metrics.daysIntoCampaign;
          bValue = b.metrics.daysIntoCampaign;
          break;
        case 'daysUntil':
          aValue = a.metrics.daysUntilEnd;
          bValue = b.metrics.daysUntilEnd;
          break;
        case 'pacing':
          aValue = a.metrics.currentPacing;
          bValue = b.metrics.currentPacing;
          break;
        case 'yesterday':
          aValue = a.metrics.yesterdayVsNeeded;
          bValue = b.metrics.yesterdayVsNeeded;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [campaigns, sortField, sortDirection]);

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="h-4 w-4 text-gray-400" />;
    }
    if (sortDirection === 'asc') {
      return <ChevronUp className="h-4 w-4 text-blue-600" />;
    }
    if (sortDirection === 'desc') {
      return <ChevronDown className="h-4 w-4 text-blue-600" />;
    }
    return <ChevronsUpDown className="h-4 w-4 text-gray-400" />;
  };
  return (
    <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <Target className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Campaign Overview</h2>
            <p className="text-indigo-100">Click on any campaign name to view detailed metrics</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide hover:text-blue-600 transition-colors duration-200"
                >
                  Campaign Name
                  {getSortIcon('name')}
                </button>
              </th>
              <th className="px-6 py-4 text-center">
                <button
                  onClick={() => handleSort('daysInto')}
                  className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide hover:text-blue-600 transition-colors duration-200 w-full"
                >
                  <Calendar className="h-4 w-4" />
                  Days Into
                  {getSortIcon('daysInto')}
                </button>
              </th>
              <th className="px-6 py-4 text-center">
                <button
                  onClick={() => handleSort('daysUntil')}
                  className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide hover:text-blue-600 transition-colors duration-200 w-full"
                >
                  <Calendar className="h-4 w-4" />
                  Days Until End
                  {getSortIcon('daysUntil')}
                </button>
              </th>
              <th className="px-6 py-4 text-center">
                <button
                  onClick={() => handleSort('pacing')}
                  className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide hover:text-blue-600 transition-colors duration-200 w-full"
                >
                  Current Pacing
                  {getSortIcon('pacing')}
                </button>
              </th>
              <th className="px-6 py-4 text-center">
                <button
                  onClick={() => handleSort('yesterday')}
                  className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide hover:text-blue-600 transition-colors duration-200 w-full"
                >
                  Yesterday's Ratio
                  {getSortIcon('yesterday')}
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/50">
            {sortedCampaigns.map((campaign) => (
              <tr
                key={campaign.name}
                className="hover:bg-blue-50/50 transition-colors duration-200 cursor-pointer group"
                onClick={() => onCampaignClick(campaign)}
              >
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {campaign.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {format(campaign.metrics.startDate, 'MMM dd')} - {format(campaign.metrics.endDate, 'MMM dd, yyyy')}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <div className="flex items-center justify-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {campaign.metrics.daysIntoCampaign}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <div className="flex items-center justify-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      {campaign.metrics.daysUntilEnd}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className={getPacingColor(campaign.metrics.currentPacing)}>
                      {getPacingIcon(campaign.metrics.currentPacing)}
                    </div>
                    <span className={`font-semibold ${getPacingColor(campaign.metrics.currentPacing)}`}>
                      {formatPercentage(campaign.metrics.currentPacing)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className={getPacingColor(campaign.metrics.yesterdayVsNeeded)}>
                      {getPacingIcon(campaign.metrics.yesterdayVsNeeded)}
                    </div>
                    <span className={`font-semibold ${getPacingColor(campaign.metrics.yesterdayVsNeeded)}`}>
                      {formatPercentage(campaign.metrics.yesterdayVsNeeded)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="bg-gray-50/80 px-6 py-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {sortedCampaigns.length} campaign{sortedCampaigns.length !== 1 ? 's' : ''}
          </p>
          {sortField && (
            <p className="text-sm text-blue-600 font-medium">
              Sorted by {sortField === 'name' ? 'Campaign Name' : 
                        sortField === 'daysInto' ? 'Days Into Campaign' :
                        sortField === 'daysUntil' ? 'Days Until End' :
                        sortField === 'pacing' ? 'Current Pacing' : 'Yesterday\'s Ratio'} 
              ({sortDirection === 'asc' ? 'ascending' : 'descending'})
            </p>
          )}
        </div>
      </div>
    </div>
  );
};