import { useMemo, useState } from 'react';
import {
  AttendanceDay,
  calculateAttendancePercentage,
  getMonthDays,
  toggleAttendance
} from '../utils/calendar';

export default function AttendanceCalendar() {
  const now = new Date();
  const [days, setDays] = useState<AttendanceDay[]>([]);

  const monthDays = useMemo(
    () => getMonthDays(now.getFullYear(), now.getMonth()),
    [now]
  );

  const percentage = calculateAttendancePercentage(days, 20);

  return (
    <div
      style={{
        background: '#101010',
        border: '1px solid #262626',
        borderRadius: 22,
        padding: 24
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20
        }}
      >
        <h3>Calendário de frequência</h3>

        <div style={{ color: '#e01616', fontWeight: 700 }}>
          {percentage}% frequência
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7,1fr)',
          gap: 10
        }}
      >
        {monthDays.map((date) => {
          const trained = days.find(
            (day) => day.date === date && day.trained
          );

          return (
            <button
              key={date}
              onClick={() => setDays(toggleAttendance(days, date))}
              style={{
                borderRadius: 14,
                padding: 14,
                border: trained
                  ? '1px solid #e01616'
                  : '1px solid #262626',
                background: trained ? '#220808' : '#0a0a0a',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              {date.split('-')[2]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
