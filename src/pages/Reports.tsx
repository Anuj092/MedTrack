import React, { useState } from 'react';
import { Download, FileText, Calendar, Filter } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { useMedications } from '../hooks/useMedications';
import { useDoseLogs } from '../hooks/useDoseLogs';
import { exportToCSV } from '../utils/analytics';

export const Reports: React.FC = () => {
  const { medications } = useMedications();
  const { doseLogs } = useDoseLogs();
  const [dateRange, setDateRange] = useState('7');
  const [selectedMedication, setSelectedMedication] = useState('all');

  const handleExportCSV = () => {
    const filteredLogs = doseLogs.filter(log => {
      const logDate = new Date(log.scheduled_time);
      const cutoffDate = subDays(new Date(), parseInt(dateRange));
      
      const isInDateRange = logDate >= cutoffDate;
      const isSelectedMedication = selectedMedication === 'all' || log.medication_id === selectedMedication;
      
      return isInDateRange && isSelectedMedication;
    });

    const csvContent = exportToCSV(filteredLogs, medications);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medication-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    // Import jsPDF dynamically to avoid bundle size issues
    const { jsPDF } = await import('jspdf');
    
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('MedTrack Report', 20, 30);
    
    // Date range
    doc.setFontSize(12);
    doc.text(`Report Period: Last ${dateRange} days`, 20, 45);
    doc.text(`Generated: ${format(new Date(), 'MMM d, yyyy')}`, 20, 55);
    
    // Summary stats
    const totalDoses = doseLogs.length;
    const takenDoses = doseLogs.filter(log => log.status === 'taken').length;
    const adherenceRate = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;
    
    doc.text('Summary:', 20, 75);
    doc.text(`Total Scheduled Doses: ${totalDoses}`, 30, 85);
    doc.text(`Doses Taken: ${takenDoses}`, 30, 95);
    doc.text(`Overall Adherence: ${adherenceRate}%`, 30, 105);
    
    // Medications list
    doc.text('Active Medications:', 20, 125);
    medications.forEach((med, index) => {
      doc.text(`${index + 1}. ${med.name} - ${med.dose} (${med.frequency_per_day}x daily)`, 30, 135 + (index * 10));
    });
    
    doc.save(`medtrack-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  const filteredLogs = doseLogs.filter(log => {
    const logDate = new Date(log.scheduled_time);
    const cutoffDate = subDays(new Date(), parseInt(dateRange));
    
    const isInDateRange = logDate >= cutoffDate;
    const isSelectedMedication = selectedMedication === 'all' || log.medication_id === selectedMedication;
    
    return isInDateRange && isSelectedMedication;
  });

  const totalDoses = filteredLogs.length;
  const takenDoses = filteredLogs.filter(log => log.status === 'taken').length;
  const missedDoses = filteredLogs.filter(log => log.status === 'missed').length;
  const lateDoses = filteredLogs.filter(log => log.status === 'late').length;
  const adherenceRate = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
        <p className="text-gray-600">Export and analyze your medication data</p>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filter Options
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
              <option value="365">Last year</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medication
            </label>
            <select
              value={selectedMedication}
              onChange={(e) => setSelectedMedication(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Medications</option>
              {medications.map(med => (
                <option key={med.id} value={med.id}>{med.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Report Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Summary</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{totalDoses}</p>
            <p className="text-sm text-blue-700">Total Doses</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{takenDoses}</p>
            <p className="text-sm text-green-700">Taken</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">{lateDoses}</p>
            <p className="text-sm text-yellow-700">Late</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{missedDoses}</p>
            <p className="text-sm text-red-700">Missed</p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-3xl font-bold text-gray-900 mb-2">{adherenceRate}%</p>
          <p className="text-gray-600">Overall Adherence Rate</p>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <FileText className="w-8 h-8 text-gray-400" />
            <div>
              <p className="font-medium text-gray-900">Export as CSV</p>
              <p className="text-sm text-gray-600">Download spreadsheet format</p>
            </div>
            <Download className="w-5 h-5 text-gray-400" />
          </button>
          
          <button
            onClick={handleExportPDF}
            className="flex items-center justify-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <FileText className="w-8 h-8 text-gray-400" />
            <div>
              <p className="font-medium text-gray-900">Export as PDF</p>
              <p className="text-sm text-gray-600">Download formatted report</p>
            </div>
            <Download className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Recent Logs Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Logs Preview</h3>
        
        {filteredLogs.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No logs found for the selected criteria</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medication
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scheduled
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.slice(0, 10).map((log) => {
                  const medication = medications.find(med => med.id === log.medication_id);
                  return (
                    <tr key={log.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(log.scheduled_time), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {medication?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(log.scheduled_time), 'h:mm a')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          log.status === 'taken' ? 'bg-green-100 text-green-800' :
                          log.status === 'missed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};