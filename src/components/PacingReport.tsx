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
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-lg text-gray-600">
          <Calendar className="h-5 w-5" />
          <span>
            {format(metrics.startDate, 'MMM dd, yyyy')} - {format(metrics.endDate, 'MMM dd, yyyy')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Campaign Basics */}
        <div className="group bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/40 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Budget</h3>
            <div className="p-2 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors duration-300">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatCurrency(metrics.budget)}</div>
        </div>

        <div className="group bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/40 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">CPM</h3>
            <div className="p-2 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors duration-300">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatCurrency(metrics.cpm)}</div>
        </div>

        <div className="group bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/40 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Impression Goal</h3>
            <div className="p-2 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors duration-300">
              <Target className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatNumber(metrics.impressionGoal)}</div>
        </div>

        {/* Campaign Timeline */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Into Campaign</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.daysIntoCampaign}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Until End</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.daysUntilEnd}</div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expected Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(metrics.expectedImpressions)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actual Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(metrics.actualImpressions)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Pacing</CardTitle>
            <div className={getPacingColor(metrics.currentPacing)}>
              {getPacingIcon(metrics.currentPacing)}
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getPacingColor(metrics.currentPacing)}`}>
              {formatPercentage(metrics.currentPacing)}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.currentPacing > 1 ? 'Ahead of pace' : 'Behind pace'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining Impressions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(metrics.remainingImpressions)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Average Needed</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(metrics.remainingAverageNeeded)}</div>
            <p className="text-xs text-muted-foreground">per remaining day</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yesterday's Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(metrics.yesterdayImpressions)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yesterday vs. Needed</CardTitle>
            <div className={getPacingColor(metrics.yesterdayVsNeeded)}>
              {getPacingIcon(metrics.yesterdayVsNeeded)}
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getPacingColor(metrics.yesterdayVsNeeded)}`}>
              {formatPercentage(metrics.yesterdayVsNeeded)}
            </div>
            <p className="text-xs text-muted-foreground">
              of daily target
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};