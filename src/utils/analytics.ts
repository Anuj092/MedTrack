import { DoseLog, AdherenceStats } from '../types';
import { startOfWeek, endOfWeek, isWithinInterval, format } from 'date-fns';

export const calculateAdherenceStats = (doseLogs: DoseLog[]): AdherenceStats => {
  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);
  
  const weeklyLogs = doseLogs.filter(log => 
    isWithinInterval(new Date(log.scheduled_time), { start: weekStart, end: weekEnd })
  );
  
  const totalDoses = doseLogs.length;
  const takenDoses = doseLogs.filter(log => log.status === 'taken').length;
  const missedDoses = doseLogs.filter(log => log.status === 'missed').length;
  
  const weeklyTotal = weeklyLogs.length;
  const weeklyTaken = weeklyLogs.filter(log => log.status === 'taken').length;
  
  // Calculate streak
  let streak = 0;
  const sortedLogs = [...doseLogs]
    .sort((a, b) => new Date(b.scheduled_time).getTime() - new Date(a.scheduled_time).getTime());
  
  for (const log of sortedLogs) {
    if (log.status === 'taken') {
      streak++;
    } else {
      break;
    }
  }

  return {
    overall_percentage: totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0,
    weekly_percentage: weeklyTotal > 0 ? Math.round((weeklyTaken / weeklyTotal) * 100) : 0,
    streak_days: streak,
    total_doses: totalDoses,
    taken_doses: takenDoses,
    missed_doses: missedDoses,
  };
};

export const generateHeatmapData = (doseLogs: DoseLog[]) => {
  const heatmapData: { [key: string]: { taken: number; total: number } } = {};
  
  doseLogs.forEach(log => {
    const date = format(new Date(log.scheduled_time), 'yyyy-MM-dd');
    
    if (!heatmapData[date]) {
      heatmapData[date] = { taken: 0, total: 0 };
    }
    
    heatmapData[date].total++;
    if (log.status === 'taken') {
      heatmapData[date].taken++;
    }
  });
  
  return Object.entries(heatmapData).map(([date, data]) => ({
    date,
    percentage: Math.round((data.taken / data.total) * 100),
  }));
};

export const exportToCSV = (doseLogs: DoseLog[], medications: any[]) => {
  const headers = ['Date', 'Time', 'Medication', 'Dose', 'Status', 'Taken Time'];
  
  const rows = doseLogs.map(log => {
    const medication = medications.find(med => med.id === log.medication_id);
    return [
      format(new Date(log.scheduled_time), 'yyyy-MM-dd'),
      format(new Date(log.scheduled_time), 'HH:mm'),
      medication?.name || 'Unknown',
      medication?.dose || '',
      log.status,
      log.taken_time ? format(new Date(log.taken_time), 'yyyy-MM-dd HH:mm') : ''
    ];
  });
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
  
  return csvContent;
};