import StudentPerformanceDashboard from './StudentPerformanceDashboard';
import StudentPRTimeline from './StudentPRTimeline';
import StudentRecoveryStatus from './StudentRecoveryStatus';
import StudentWeeklyVolume from './StudentWeeklyVolume';

type Props = {
  studentId?: string;
};

export default function StudentIntelligencePanel({ studentId }: Props) {
  return (
    <div>
      <StudentPerformanceDashboard />
      <StudentWeeklyVolume />
      <StudentRecoveryStatus studentId={studentId} />
      <StudentPRTimeline studentId={studentId} />
    </div>
  );
}
