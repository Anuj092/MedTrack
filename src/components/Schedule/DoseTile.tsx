import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface DoseTileProps {
  medication: string;
  dose: string;
  scheduledTime: Date;
  status: 'pending' | 'taken' | 'missed' | 'late';
  color: string;
  onMarkTaken: () => void;
}

export const DoseTile: React.FC<DoseTileProps> = ({
  medication,
  dose,
  scheduledTime,
  status,
  color,
  onMarkTaken
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'taken':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'missed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'late':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'taken':
        return 'border-green-200 bg-green-50';
      case 'missed':
        return 'border-red-200 bg-red-50';
      case 'late':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-white hover:shadow-md';
    }
  };

  return (
    <div className={`rounded-xl border-2 p-4 transition-all ${getStatusColor()}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: color + '20' }}
          >
            <div 
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: color }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{medication}</h3>
            <p className="text-sm text-gray-600">{dose}</p>
          </div>
        </div>
        {getStatusIcon()}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          {format(scheduledTime, 'h:mm a')}
        </span>
        
        {status === 'pending' && (
          <button
            onClick={onMarkTaken}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-teal-600 transition-all"
          >
            Mark Taken
          </button>
        )}
        
        {status !== 'pending' && (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            status === 'taken' ? 'bg-green-100 text-green-800' :
            status === 'missed' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        )}
      </div>
    </div>
  );
};