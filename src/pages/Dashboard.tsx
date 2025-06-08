import React from 'react';
import { Pill, Target, TrendingUp, Calendar } from 'lucide-react';
import { StatsCard } from '../components/Dashboard/StatsCard';
import { AdherenceHeatmap } from '../components/Dashboard/AdherenceHeatmap';
import { RecentActivity } from '../components/Dashboard/RecentActivity';
import { useMedications } from '../hooks/useMedications';
import { useDoseLogs } from '../hooks/useDoseLogs';
import { calculateAdherenceStats, generateHeatmapData } from '../utils/analytics';

interface DashboardProps {
  onNavigate?: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { medications } = useMedications();
  const { doseLogs } = useDoseLogs();
  
  const stats = calculateAdherenceStats(doseLogs);
  const heatmapData = generateHeatmapData(doseLogs);
  
  // Mock recent activity data
  const recentActivities = [
    {
      id: '1',
      type: 'taken' as const,
      medication: 'Aspirin 100mg',
      time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    },
    {
      id: '2',
      type: 'missed' as const,
      medication: 'Vitamin D 1000IU',
      time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: '3',
      type: 'taken' as const,
      medication: 'Metformin 500mg',
      time: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    },
  ];

  const handleQuickAction = (action: string) => {
    if (onNavigate) {
      switch (action) {
        case 'add-medication':
          onNavigate('medications');
          break;
        case 'log-dose':
          onNavigate('schedule');
          break;
        case 'view-schedule':
          onNavigate('schedule');
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Track your medication adherence and health progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Overall Adherence"
          value={`${stats.overall_percentage}%`}
          icon={Target}
          color="blue"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Current Streak"
          value={`${stats.streak_days} days`}
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          title="Active Medications"
          value={medications.length}
          icon={Pill}
          color="yellow"
        />
        <StatsCard
          title="This Week"
          value={`${stats.weekly_percentage}%`}
          icon={Calendar}
          color="red"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AdherenceHeatmap data={heatmapData} />
        </div>
        <div>
          <RecentActivity activities={recentActivities} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button 
            onClick={() => handleQuickAction('add-medication')}
            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-all duration-200 hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Pill className="w-6 h-6 text-blue-600 mb-2" />
            <p className="font-medium text-blue-900">Add Medication</p>
            <p className="text-sm text-blue-600">Set up a new medication</p>
          </button>
          
          <button 
            onClick={() => handleQuickAction('log-dose')}
            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-all duration-200 hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <Target className="w-6 h-6 text-green-600 mb-2" />
            <p className="font-medium text-green-900">Log Dose</p>
            <p className="text-sm text-green-600">Mark medication as taken</p>
          </button>
          
          <button 
            onClick={() => handleQuickAction('view-schedule')}
            className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-all duration-200 hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <Calendar className="w-6 h-6 text-purple-600 mb-2" />
            <p className="font-medium text-purple-900">View Schedule</p>
            <p className="text-sm text-purple-600">See today's medications</p>
          </button>
        </div>
      </div>
    </div>
  );
};