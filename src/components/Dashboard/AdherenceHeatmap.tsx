import React from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';

interface AdherenceData {
  date: string;
  percentage: number;
}

interface AdherenceHeatmapProps {
  data: AdherenceData[];
}

export const AdherenceHeatmap: React.FC<AdherenceHeatmapProps> = ({ data }) => {
  const today = new Date();
  const startDate = startOfWeek(addDays(today, -49)); // Show last 7 weeks
  
  const getIntensity = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-green-300';
    if (percentage >= 50) return 'bg-yellow-300';
    if (percentage > 0) return 'bg-red-300';
    return 'bg-gray-200';
  };

  const weeks = [];
  for (let week = 0; week < 7; week++) {
    const days = [];
    for (let day = 0; day < 7; day++) {
      const currentDate = addDays(startDate, week * 7 + day);
      const adherenceData = data.find(d => isSameDay(new Date(d.date), currentDate));
      const percentage = adherenceData?.percentage || 0;
      
      days.push({
        date: currentDate,
        percentage,
        intensity: getIntensity(percentage),
      });
    }
    weeks.push(days);
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Adherence Heatmap</h3>
      
      <div className="flex space-x-1">
        <div className="flex flex-col space-y-1 mr-2">
          {weekDays.map((day) => (
            <div key={day} className="text-xs text-gray-500 h-3 flex items-center">
              {day}
            </div>
          ))}
        </div>
        
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col space-y-1">
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className={`w-3 h-3 rounded-sm ${day.intensity} hover:ring-2 hover:ring-blue-300 cursor-pointer transition-all`}
                title={`${format(day.date, 'MMM d')}: ${day.percentage}% adherence`}
              />
            ))}
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
        <span>Less</span>
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-gray-200 rounded-sm" />
          <div className="w-3 h-3 bg-red-300 rounded-sm" />
          <div className="w-3 h-3 bg-yellow-300 rounded-sm" />
          <div className="w-3 h-3 bg-green-300 rounded-sm" />
          <div className="w-3 h-3 bg-green-500 rounded-sm" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
};