import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, subDays, startOfDay } from 'date-fns';
import { DoseTile } from '../components/Schedule/DoseTile';
import { RewardModal } from '../components/Schedule/RewardModal';
import { useMedications } from '../hooks/useMedications';
import { useDoseLogs } from '../hooks/useDoseLogs';

export const Schedule: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showReward, setShowReward] = useState(false);
  const [rewardData, setRewardData] = useState({ streak: 0, message: '' });
  
  const { medications } = useMedications();
  const { doseLogs, logDose } = useDoseLogs();

  // Generate scheduled doses for the selected date
  const getScheduledDoses = () => {
    const doses: any[] = [];
    const selectedDateStart = startOfDay(selectedDate);
    
    medications.forEach(medication => {
      medication.reminder_times.forEach(time => {
        const [hours, minutes] = time.split(':').map(Number);
        const scheduledTime = new Date(selectedDateStart);
        scheduledTime.setHours(hours, minutes, 0, 0);
        
        // Find existing log for this dose
        const existingLog = doseLogs.find(log => 
          log.medication_id === medication.id &&
          Math.abs(new Date(log.scheduled_time).getTime() - scheduledTime.getTime()) < 60000 // Within 1 minute
        );
        
        doses.push({
          id: `${medication.id}-${time}`,
          medication: medication.name,
          dose: medication.dose,
          scheduledTime,
          status: existingLog?.status || 'pending',
          color: medication.color,
          medicationId: medication.id,
        });
      });
    });
    
    return doses.sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());
  };

  const handleMarkTaken = async (dose: any) => {
    try {
      const now = new Date();
      const scheduledTime = dose.scheduledTime;
      const timeDiff = now.getTime() - scheduledTime.getTime();
      const fourHours = 4 * 60 * 60 * 1000;
      
      let status: 'taken' | 'late' = 'taken';
      if (timeDiff > fourHours) {
        status = 'late';
      }
      
      await logDose(dose.medicationId, dose.scheduledTime.toISOString(), status);
      
      // Check for rewards
      const recentLogs = doseLogs.filter(log => 
        log.status === 'taken' && 
        new Date(log.taken_time!).getTime() > (now.getTime() - 7 * 24 * 60 * 60 * 1000)
      );
      
      if (recentLogs.length > 0 && recentLogs.length % 7 === 0) {
        setRewardData({
          streak: recentLogs.length,
          message: `Amazing! You've taken ${recentLogs.length} doses on time this week!`
        });
        setShowReward(true);
      }
    } catch (error) {
      console.error('Error marking dose as taken:', error);
    }
  };

  const scheduledDoses = getScheduledDoses();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Schedule</h1>
          <p className="text-gray-600">Today's medication schedule</p>
        </div>
        
        {/* Date Navigation */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSelectedDate(subDays(selectedDate, 1))}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-900">
              {format(selectedDate, 'EEEE, MMM d')}
            </span>
          </div>
          
          <button
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quick Date Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => setSelectedDate(subDays(new Date(), 1))}
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Yesterday
        </button>
        <button
          onClick={() => setSelectedDate(new Date())}
          className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-700 rounded-lg"
        >
          Today
        </button>
        <button
          onClick={() => setSelectedDate(addDays(new Date(), 1))}
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Tomorrow
        </button>
      </div>

      {/* Scheduled Doses */}
      {scheduledDoses.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No doses scheduled</h3>
          <p className="text-gray-500">
            No medications are scheduled for {format(selectedDate, 'EEEE, MMM d')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scheduledDoses.map((dose) => (
            <DoseTile
              key={dose.id}
              medication={dose.medication}
              dose={dose.dose}
              scheduledTime={dose.scheduledTime}
              status={dose.status}
              color={dose.color}
              onMarkTaken={() => handleMarkTaken(dose)}
            />
          ))}
        </div>
      )}

      {/* Progress Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Progress</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {scheduledDoses.filter(d => d.status === 'taken').length}
            </p>
            <p className="text-sm text-gray-600">Taken</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {scheduledDoses.filter(d => d.status === 'late').length}
            </p>
            <p className="text-sm text-gray-600">Late</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {scheduledDoses.filter(d => d.status === 'missed').length}
            </p>
            <p className="text-sm text-gray-600">Missed</p>
          </div>
        </div>
      </div>

      <RewardModal
        isOpen={showReward}
        onClose={() => setShowReward(false)}
        streak={rewardData.streak}
        message={rewardData.message}
      />
    </div>
  );
};