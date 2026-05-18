import StudentPerformanceDashboard from './StudentPerformanceDashboard';
import StudentPRTimeline from './StudentPRTimeline';
import StudentRecoveryStatus from './StudentRecoveryStatus';
import StudentWeeklyVolume from './StudentWeeklyVolume';

export default function StudentIntelligencePanel() {
  return (
    <div>
      <StudentPerformanceDashboard />
      <StudentWeeklyVolume />
      <StudentRecoveryStatus />
      <StudentPRTimeline />
    </div>
  );
}
