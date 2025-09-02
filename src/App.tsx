import { useState } from 'react';
import { CSVUploader } from '@/components/CSVUploader';
import { CampaignOverviewTable } from '@/components/CampaignOverviewTable';
import { PacingReport } from '@/components/PacingReport';
import { Modal } from '@/components/Modal';
import type { ContractTerms, DeliveryData, ProcessedCampaign } from '@/types';
import { processCampaigns } from '@/lib/calculations';
import { BarChart3 } from 'lucide-react';

function App() {
  const [campaigns, setCampaigns] = useState<ProcessedCampaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<ProcessedCampaign | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDataLoaded = (contractTerms: ContractTerms[], deliveryData: DeliveryData[]) => {
    try {
      const processedCampaigns = processCampaigns(contractTerms, deliveryData);
      setCampaigns(processedCampaigns);
      setSelectedCampaign(null);
      setIsModalOpen(false);
      
      // Show success message with info about any skipped campaigns
      if (processedCampaigns.length === 0) {
        setError('No campaigns could be processed. Please check your data format and try again.');
      } else if (processedCampaigns.length < contractTerms.length) {
        const skippedCount = contractTerms.length - processedCampaigns.length;
        setError(`Successfully loaded ${processedCampaigns.length} campaigns. ${skippedCount} campaigns were skipped due to missing or invalid data. Check the browser console for details.`);
      } else {
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error processing campaign data');
      setCampaigns([]);
    }
  };

  const handleCampaignClick = (campaign: ProcessedCampaign) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCampaign(null);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Campaign Pacing Report
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Upload your campaign data to monitor delivery pacing and performance metrics with real-time insights
          </p>
        </div>

        {campaigns.length === 0 ? (
          <div className="max-w-5xl mx-auto">
            <CSVUploader onDataLoaded={handleDataLoaded} />
          </div>
        ) : (
          <div className="space-y-10">
            <div className="max-w-7xl mx-auto">
              <CampaignOverviewTable
                campaigns={campaigns}
                onCampaignClick={handleCampaignClick}
              />
            </div>

            <div className="text-center">
              <button
                onClick={() => {
                  setCampaigns([]);
                  setSelectedCampaign(null);
                  setIsModalOpen(false);
                  setError(null);
                }}
                className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm text-gray-700 hover:text-blue-600 rounded-xl shadow-lg border border-white/20 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
              >
                Upload new files
              </button>
            </div>
          </div>
        )}

        {/* Modal for detailed campaign metrics */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal}
          title={selectedCampaign?.name}
        >
          {selectedCampaign && (
            <PacingReport campaign={selectedCampaign} />
          )}
        </Modal>

        {error && (
          <div className="max-w-3xl mx-auto mt-8">
            <div className="bg-amber-50/80 backdrop-blur-sm border border-amber-200/50 rounded-2xl shadow-lg p-6">
              <p className="text-amber-800 text-center font-medium">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
