import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProcessedCampaign } from '@/types';
import { TrendingUp, TrendingDown, Target, Calendar, DollarSign, Eye } from 'lucide-react';

interface PacingReportProps {
  campaign: ProcessedCampaign;
}

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(Math.round(num));
};

const formatCurrency = (num: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(num);
};

const formatPercentage = (num: number): string => {
  return `${(num * 100).toFixed(1)}%`;
};

const getPacingColor = (pacing: number): string => {
  if (pacing >= 0.95 && pacing <= 1.05) return 'text-green-600';
  if (pacing >= 0.85 && pacing <= 1.15) return 'text-yellow-600';
  return 'text-red-600';
};

const getPacingIcon = (pacing: number) => {
  if (pacing > 1) return <TrendingUp className="h-5 w-5" />;
  return <TrendingDown className="h-5 w-5" />;
};

export const PacingReport: React.FC<PacingReportProps> = ({ campaign }) => {
  const { metrics } = campaign;

  // Add error boundary check
  if (!campaign || !metrics) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error: Campaign data is missing or invalid</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Campaign Info Row */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200/50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 uppercase tracking-wide">
              <Calendar className="h-4 w-4" />
              Campaign Period
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {format(metrics.startDate, 'MMM dd')} - {format(metrics.endDate, 'MMM dd, yyyy')}
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 uppercase tracking-wide">
              <DollarSign className="h-4 w-4" />
              Budget
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {formatCurrency(metrics.budget)}
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 uppercase tracking-wide">
              <DollarSign className="h-4 w-4" />
              CPM
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {formatCurrency(metrics.cpm)}
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 uppercase tracking-wide">
              <Target className="h-4 w-4" />
              Impression Goal
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {formatNumber(metrics.impressionGoal)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Campaign Timeline */}
        <div className="group bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/40 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Days Into Campaign</h3>
            <div className="p-2 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors duration-300">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{metrics.daysIntoCampaign}</div>
        </div>

        <div className="group bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/40 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Days Until End</h3>
            <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-gray-200 transition-colors duration-300">
              <Calendar className="h-5 w-5 text-gray-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{metrics.daysUntilEnd}</div>
        </div>

        {/* Performance Metrics */}
        <div className="group bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/40 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Expected Impressions</h3>
            <div className="p-2 bg-indigo-100 rounded-xl group-hover:bg-indigo-200 transition-colors duration-300">
              <Eye className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatNumber(metrics.expectedImpressions)}</div>
        </div>

        <div className="group bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/40 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Actual Impressions</h3>
            <div className="p-2 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors duration-300">
              <Eye className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatNumber(metrics.actualImpressions)}</div>
        </div>

        <div className="group bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/40 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Current Pacing</h3>
            <div className={`p-2 rounded-xl transition-colors duration-300 ${
              metrics.currentPacing >= 0.95 && metrics.currentPacing <= 1.05 
                ? 'bg-green-100 group-hover:bg-green-200' 
                : metrics.currentPacing >= 0.85 && metrics.currentPacing <= 1.15
                ? 'bg-yellow-100 group-hover:bg-yellow-200'
                : 'bg-red-100 group-hover:bg-red-200'
            }`}>
              <div className={getPacingColor(metrics.currentPacing)}>
                {getPacingIcon(metrics.currentPacing)}
              </div>
            </div>
          </div>
          <div className={`text-3xl font-bold ${getPacingColor(metrics.currentPacing)}`}>
            {formatPercentage(metrics.currentPacing)}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {metrics.currentPacing > 1 ? 'Ahead of pace' : 'Behind pace'}
          </p>
        </div>

        <div className="group bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/40 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Remaining Impressions</h3>
            <div className="p-2 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors duration-300">
              <Target className="h-5 w-5 text-orange-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatNumber(metrics.remainingImpressions)}</div>
        </div>

        <div className="group bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/40 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Daily Average Needed</h3>
            <div className="p-2 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors duration-300">
              <Target className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatNumber(metrics.remainingAverageNeeded)}</div>
          <p className="text-xs text-gray-500 mt-2">per remaining day</p>
        </div>

        <div className="group bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/40 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Yesterday's Impressions</h3>
            <div className="p-2 bg-cyan-100 rounded-xl group-hover:bg-cyan-200 transition-colors duration-300">
              <Eye className="h-5 w-5 text-cyan-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatNumber(metrics.yesterdayImpressions)}</div>
        </div>

        <div className="group bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/40 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Yesterday vs. Needed</h3>
            <div className={`p-2 rounded-xl transition-colors duration-300 ${
              metrics.yesterdayVsNeeded >= 0.95 && metrics.yesterdayVsNeeded <= 1.05 
                ? 'bg-green-100 group-hover:bg-green-200' 
                : metrics.yesterdayVsNeeded >= 0.85 && metrics.yesterdayVsNeeded <= 1.15
                ? 'bg-yellow-100 group-hover:bg-yellow-200'
                : 'bg-red-100 group-hover:bg-red-200'
            }`}>
              <div className={getPacingColor(metrics.yesterdayVsNeeded)}>
                {getPacingIcon(metrics.yesterdayVsNeeded)}
              </div>
            </div>
          </div>
          <div className={`text-3xl font-bold ${getPacingColor(metrics.yesterdayVsNeeded)}`}>
            {formatPercentage(metrics.yesterdayVsNeeded)}
          </div>
          <p className="text-xs text-gray-500 mt-2">of daily target</p>
        </div>
      </div>
    </div>
  );
};