import { differenceInDays, parseISO } from 'date-fns';
import type { ContractTerms, DeliveryData, CampaignMetrics, ProcessedCampaign } from '../types';

export const parseCampaignDate = (dateStr: string): Date => {
  if (!dateStr) {
    throw new Error('Date string is empty or undefined');
  }
  
  // Try parsing as ISO format first (YYYY-MM-DD)
  try {
    const parsed = parseISO(dateStr);
    if (isNaN(parsed.getTime())) {
      // If parseISO fails, try regular Date constructor
      const fallback = new Date(dateStr);
      if (isNaN(fallback.getTime())) {
        throw new Error(`Invalid date format: ${dateStr}`);
      }
      return fallback;
    }
    return parsed;
  } catch (error) {
    throw new Error(`Failed to parse date "${dateStr}": ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const calculateCampaignMetrics = (
  contractTerms: ContractTerms,
  deliveryData: DeliveryData[]
): CampaignMetrics => {
  try {
    // Validate input data
    if (!contractTerms) {
      throw new Error('Contract terms data is missing');
    }
    
    if (!contractTerms.Budget || !contractTerms.CPM || !contractTerms['Impressions Goal']) {
      throw new Error('Missing required fields in contract terms');
    }
    
    const budget = parseFloat((contractTerms.Budget || '0').replace(/[$,]/g, ''));
    const cpm = parseFloat((contractTerms.CPM || '0').replace(/[$,]/g, ''));
    const impressionGoal = parseInt((contractTerms['Impressions Goal'] || '0').replace(/[,]/g, ''));
    
    if (isNaN(budget) || isNaN(cpm) || isNaN(impressionGoal)) {
      throw new Error(`Invalid numeric values - Budget: ${contractTerms.Budget}, CPM: ${contractTerms.CPM}, Impressions Goal: ${contractTerms['Impressions Goal']}`);
    }
    
    const startDate = parseCampaignDate(contractTerms['Start Date']);
    const endDate = parseCampaignDate(contractTerms['End Date']);
    const today = new Date();
  
  // Calculate campaign duration (inclusive of both start and end dates)
  const totalCampaignDays = differenceInDays(endDate, startDate) + 1;
  
  // Calculate days into campaign and days remaining
  const daysIntoCampaign = Math.max(0, Math.min(
    differenceInDays(today, startDate) + 1,
    totalCampaignDays
  ));
  const daysUntilEnd = Math.max(0, differenceInDays(endDate, today));
  
  // Calculate expected impressions (total goal / total days * days elapsed)
  const averageDailyImpressions = impressionGoal / totalCampaignDays;
  const expectedImpressions = averageDailyImpressions * daysIntoCampaign;
  
  // Calculate actual impressions from delivery data
  const actualImpressions = deliveryData
    .filter(row => row['CAMPAIGN ORDER NAME'] === contractTerms.Name)
    .reduce((sum, row) => sum + parseInt(row.IMPRESSIONS.replace(/[,]/g, '') || '0'), 0);
  
  // Calculate current pacing (actual / expected)
  const currentPacing = expectedImpressions > 0 ? (actualImpressions / expectedImpressions) : 0;
  
  // Calculate remaining impressions needed
  const remainingImpressions = Math.max(0, impressionGoal - actualImpressions);
  
  // Calculate remaining average needed per day
  const remainingAverageNeeded = daysUntilEnd > 0 ? remainingImpressions / daysUntilEnd : 0;
  
  // Get yesterday's impressions (most recent day in delivery data for this campaign)
  const campaignDeliveryData = deliveryData
    .filter(row => row['CAMPAIGN ORDER NAME'] === contractTerms.Name)
    .sort((a, b) => new Date(b.DATE).getTime() - new Date(a.DATE).getTime());
  
  const yesterdayImpressions = campaignDeliveryData.length > 0 
    ? parseInt(campaignDeliveryData[0].IMPRESSIONS.replace(/[,]/g, '') || '0')
    : 0;
  
  // Calculate yesterday vs remaining needed
  const yesterdayVsNeeded = remainingAverageNeeded > 0 ? (yesterdayImpressions / remainingAverageNeeded) : 0;
  
    return {
      campaignName: contractTerms.Name,
      budget,
      cpm,
      impressionGoal,
      startDate,
      endDate,
      daysIntoCampaign,
      daysUntilEnd,
      expectedImpressions,
      actualImpressions,
      currentPacing,
      remainingImpressions,
      remainingAverageNeeded,
      yesterdayImpressions,
      yesterdayVsNeeded
    };
  } catch (error) {
    console.error('Error calculating campaign metrics:', error);
    throw error;
  }
};

export const processCampaigns = (
  contractTermsData: ContractTerms[],
  deliveryData: DeliveryData[]
): ProcessedCampaign[] => {
  const processedCampaigns: ProcessedCampaign[] = [];
  const skippedCampaigns: string[] = [];

  contractTermsData.forEach(contractTerms => {
    try {
      const campaignDeliveryData = deliveryData.filter(
        row => row['CAMPAIGN ORDER NAME'] === contractTerms.Name
      );
      
      const metrics = calculateCampaignMetrics(contractTerms, deliveryData);
      
      processedCampaigns.push({
        name: contractTerms.Name,
        contractTerms,
        deliveryData: campaignDeliveryData,
        metrics
      });
    } catch (error) {
      console.warn(`Skipping campaign "${contractTerms.Name}" due to error:`, error);
      skippedCampaigns.push(contractTerms.Name);
    }
  });

  if (skippedCampaigns.length > 0) {
    console.log(`Successfully processed ${processedCampaigns.length} campaigns. Skipped ${skippedCampaigns.length} campaigns with errors: ${skippedCampaigns.join(', ')}`);
  }

  return processedCampaigns;
};