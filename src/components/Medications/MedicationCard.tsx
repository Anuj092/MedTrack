import React, { useEffect } from 'react';
import { Pill, Clock, User, Edit, Trash2 } from 'lucide-react';
import type { Medication } from '../../types';

interface MedicationCardProps {
  medication: Medication;
  onEdit: (medication: Medication) => void;
  onDelete: (id: string) => void;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({ medication, onEdit, onDelete }) => {
  // Notify user
  function notifyUser(medName: string, time: string) {
    if (Notification.permission === 'granted') {
      new Notification(`Reminder: Take ${medName} at ${time}`);
    }
  }

  // Schedule notifications
  function scheduleReminders(med: Medication) {
    const now = new Date();
    med.reminder_times.forEach(timeStr => {
      const [hour, minute] = timeStr.split(':').map(Number);
      const reminder = new Date();
      reminder.setHours(hour, minute, 0, 0);

      if (reminder > now) {
        const delay = reminder.getTime() - now.getTime();
        setTimeout(() => notifyUser(med.name, timeStr), delay);
      }
    });
  }

  useEffect(() => {
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(p => {
          if (p === 'granted') scheduleReminders(medication);
        });
      } else if (Notification.permission === 'granted') {
        scheduleReminders(medication);
      }
    }
  }, [medication]);

  // ------------------ Google Calendar Integration ------------------

  const CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
  const API_KEY = 'YOUR_API_KEY_HERE';
  const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

  const loadGapi = () =>
    new Promise<void>((resolve) => {
      const existingScript = document.getElementById('gapi-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'gapi-script';
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => window.gapi.load('client:auth2', resolve);
        document.body.appendChild(script);
      } else {
        resolve();
      }
    });

  const initClient = () =>
    window.gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      scope: SCOPES,
    });

  const signIn = async () => {
    const GoogleAuth = window.gapi.auth2.getAuthInstance();
    if (!GoogleAuth.isSignedIn.get()) {
      await GoogleAuth.signIn();
    }
  };

  const addMedicationEvent = async (med: Medication, time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    const start = new Date();
    start.setHours(hour, minute, 0, 0);
    const end = new Date(start.getTime() + 30 * 60000);

    const event = {
      summary: `Take medication: ${med.name}`,
      description: `Dose: ${med.dose}`,
      start: {
        dateTime: start.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      reminders: {
        useDefault: false,
        overrides: [{ method: 'popup', minutes: 10 }],
      },
    };

    return window.gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });
  };

  const handleAddToCalendar = async () => {
    try {
      await loadGapi();
      await initClient();
      await signIn();

      for (const time of medication.reminder_times) {
        await addMedicationEvent(medication, time);
      }

      alert('Reminders added to Google Calendar!');
    } catch (err) {
      console.error('Calendar Error:', err);
      alert('Failed to add reminders. See console.');
    }
  };

  // ------------------ JSX ------------------

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: medication.color + '20' }}
          >
            <Pill className="w-6 h-6" style={{ color: medication.color }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{medication.name}</h3>
            <p className="text-sm text-gray-600">{medication.dose}</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(medication)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(medication.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{medication.frequency_per_day}x daily</span>
        </div>

        {medication.family_member && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>{medication.family_member}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {medication.category}
          </span>
          <div className="text-xs text-gray-500">
            {medication.reminder_times.length} reminders
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-1">Reminders:</h4>
          <div className="flex flex-wrap gap-2 mb-3">
            {medication.reminder_times.map((time, idx) => (
              <span key={idx} className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                {time}
              </span>
            ))}
          </div>

          <button
            onClick={handleAddToCalendar}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition"
          >
            Add to Google Calendar
          </button>
        </div>
      </div>
    </div>
  );
};
