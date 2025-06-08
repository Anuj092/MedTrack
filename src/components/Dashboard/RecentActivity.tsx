import React from 'react';
import { CheckCircle, XCircle, Clock, Pill } from 'lucide-react';
import { format } from 'date-fns';

interface Activity {
  id: string;
  type: 'taken' | 'missed' | 'late' | 'added';
  medication: string;
  time: Date;
  status?: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'taken':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'missed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'late':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'added':
        return <Pill className="w-5 h-5 text-blue-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'taken':
        return `Took ${activity.medication}`;
      case 'missed':
        return `Missed ${activity.medication}`;
      case 'late':
        return `Took ${activity.medication} (late)`;
      case 'added':
        return `Added ${activity.medication}`;
      default:
        return `Activity for ${activity.medication}`;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No recent activity</p>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              {getActivityIcon(activity.type)}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {getActivityText(activity)}
                </p>
                <p className="text-xs text-gray-500">
                  {format(activity.time, 'MMM d, h:mm a')}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};