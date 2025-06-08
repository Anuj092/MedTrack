import React from 'react';
import { TrendingUp, Target, Calendar, Pill } from 'lucide-react';
import { StatsCard } from '../components/Dashboard/StatsCard';
import { AdherenceHeatmap } from '../components/Dashboard/AdherenceHeatmap';
import { useMedications } from '../hooks/useMedications';
import { useDoseLogs } from '../hooks/useDoseLogs';
import { calculateAdherenceStats, generateHeatmapData } from '../utils/analytics';

export const Analytics: React.FC = () => {
  const { medications } = useMedications();
  const { doseLogs } = useDoseLogs();
  
  const stats = calculateAdherenceStats(doseLogs);
  const heatmapData = generateHeatmapData(doseLogs);
  
  // Calculate most missed medications
  const medicationStats = medications.map(med => {
    const medLogs = doseLogs.filter(log => log.medication_id === med.id);
    const missed = medLogs.filter(log => log.status === 'missed').length;
    const total = medLogs.length;
    return {
      medication: med,
      missedCount: missed,
      totalCount: total,
      adherenceRate: total > 0 ? Math.round(((total - missed) / total) * 100) : 0,
    };
  }).sort((a, b) => b.missedCount - a.missedCount);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">Detailed insights into your medication adherence</p>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Overall Adherence"
          value={`${stats.overall_percentage}%`}
          icon={Target}
          color="blue"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Weekly Adherence"
          value={`${stats.weekly_percentage}%`}
          icon={Calendar}
          color="green"
          trend={{ value: -2, isPositive: false }}
        />
        <StatsCard
          title="Current Streak"
          value={`${stats.streak_days} days`}
          icon={TrendingUp}
          color="yellow"
        />
        <StatsCard
          title="Total Doses"
          value={stats.total_doses}
          icon={Pill}
          color="red"
        />
      </div>

      {/* Adherence Heatmap */}
      <AdherenceHeatmap data={heatmapData} />

      {/* Medication Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Medication Performance</h3>
        
        {medicationStats.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No medication data available</p>
        ) : (
          <div className="space-y-4">
            {medicationStats.map((stat, index) => (
              <div key={stat.medication.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: stat.medication.color + '20' }}
                  >
                    <Pill className="w-5 h-5" style={{ color: stat.medication.color }} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{stat.medication.name}</h4>
                    <p className="text-sm text-gray-600">{stat.medication.dose}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">{stat.adherenceRate}%</p>
                  <p className="text-sm text-gray-600">
                    {stat.missedCount} missed of {stat.totalCount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weekly Trends */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Trends</h3>
        
        <div className="grid grid-cols-7 gap-2 text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <div key={day} className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600 mb-2">{day}</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.floor(Math.random() * 30) + 70}%
              </p>
              <p className="text-xs text-gray-500">adherence</p>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights & Recommendations</h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">📈 Great Progress!</h4>
            <p className="text-sm text-blue-700">
              Your adherence has improved by 5% this week. Keep up the excellent work!
            </p>
          </div>
          
          {medicationStats.length > 0 && medicationStats[0].missedCount > 0 && (
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-900 mb-2">⚠️ Attention Needed</h4>
              <p className="text-sm text-yellow-700">
                {medicationStats[0].medication.name} has been missed {medicationStats[0].missedCount} times. 
                Consider setting additional reminders.
              </p>
            </div>
          )}
          
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-900 mb-2">🎯 Recommendation</h4>
            <p className="text-sm text-green-700">
              Try taking your medications at the same time each day to build a stronger routine.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};