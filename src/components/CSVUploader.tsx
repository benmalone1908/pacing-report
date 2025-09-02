import React, { useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { parseContractTermsCSV, parseDeliveryDataCSV } from '@/lib/csvParser';
import type { ContractTerms, DeliveryData } from '@/types';

interface CSVUploaderProps {
  onDataLoaded: (contractTerms: ContractTerms[], deliveryData: DeliveryData[]) => void;
}

export const CSVUploader: React.FC<CSVUploaderProps> = ({ onDataLoaded }) => {
  const [contractTermsFile, setContractTermsFile] = useState<File | null>(null);
  const [deliveryDataFile, setDeliveryDataFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContractTermsUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setContractTermsFile(file);
      setError(null);
    }
  };

  const handleDeliveryDataUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setDeliveryDataFile(file);
      setError(null);
    }
  };

  const handleProcessFiles = async () => {
    if (!contractTermsFile || !deliveryDataFile) {
      setError('Please upload both CSV files');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [contractTerms, deliveryData] = await Promise.all([
        parseContractTermsCSV(contractTermsFile),
        parseDeliveryDataCSV(deliveryDataFile)
      ]);

      onDataLoaded(contractTerms, deliveryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing the files');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 overflow-hidden hover:shadow-3xl transition-all duration-300">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h3 className="flex items-center gap-3 text-xl font-bold text-white">
              <div className="p-2 bg-white/20 rounded-xl">
                <FileText className="h-6 w-6" />
              </div>
              Contract Terms CSV
            </h3>
            <p className="text-blue-100 mt-2 leading-relaxed">
              Upload the contract terms file containing campaign names, budgets, CPM, and impression goals
            </p>
          </div>
          <div className="p-8">
            <input
              type="file"
              accept=".csv"
              onChange={handleContractTermsUpload}
              className="hidden"
              id="contract-terms-upload"
            />
            <label htmlFor="contract-terms-upload" className="block">
              <div className="relative border-2 border-dashed border-blue-200 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="inline-flex p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Upload className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-lg font-semibold text-gray-800 mb-2">
                    {contractTermsFile ? contractTermsFile.name : 'Click to upload contract terms CSV'}
                  </p>
                  <p className="text-sm text-gray-500">CSV files only</p>
                </div>
              </div>
            </label>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 overflow-hidden hover:shadow-3xl transition-all duration-300">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-6">
            <h3 className="flex items-center gap-3 text-xl font-bold text-white">
              <div className="p-2 bg-white/20 rounded-xl">
                <FileText className="h-6 w-6" />
              </div>
              Delivery Data CSV
            </h3>
            <p className="text-emerald-100 mt-2 leading-relaxed">
              Upload the delivery data file containing daily impressions and spend by campaign
            </p>
          </div>
          <div className="p-8">
            <input
              type="file"
              accept=".csv"
              onChange={handleDeliveryDataUpload}
              className="hidden"
              id="delivery-data-upload"
            />
            <label htmlFor="delivery-data-upload" className="block">
              <div className="relative border-2 border-dashed border-emerald-200 rounded-2xl p-8 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-all duration-300 group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 to-teal-50/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="inline-flex p-4 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Upload className="h-8 w-8 text-emerald-600" />
                  </div>
                  <p className="text-lg font-semibold text-gray-800 mb-2">
                    {deliveryDataFile ? deliveryDataFile.name : 'Click to upload delivery data CSV'}
                  </p>
                  <p className="text-sm text-gray-500">CSV files only</p>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 text-red-700 mb-2">
            <div className="p-2 bg-red-100 rounded-xl">
              <AlertCircle className="h-5 w-5" />
            </div>
            <p className="font-bold text-lg">Error</p>
          </div>
          <p className="text-red-600 leading-relaxed">{error}</p>
        </div>
      )}

      <div className="flex justify-center pt-4">
        <button
          onClick={handleProcessFiles}
          disabled={!contractTermsFile || !deliveryDataFile || loading}
          className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
          <span className="relative text-lg">
            {loading ? 'Processing...' : 'Process Files'}
          </span>
        </button>
      </div>
    </div>
  );
};