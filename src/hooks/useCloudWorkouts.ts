import { useEffect, useState } from 'react';
import { cloudDataService } from '../services/cloudDataService';

type CloudWorkout = {
  id?: string;
  student_id: string;
  week: number;
  name: string;
  split?: string;
  notes?: string;
  exercises?: unknown[];
};

export function useCloudWorkouts(studentId?: string) {
  const [workouts, setWorkouts] = useState<CloudWorkout[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Cloud workouts não iniciado.');

  async function loadWorkouts() {
    if (!studentId) return;
    setLoading(true);
    const result = await cloudDataService.getWorkouts(studentId);
    setLoading(false);
    setMessage(result.message);

    if (result.ok && Array.isArray(result.data)) {
      setWorkouts(result.data as CloudWorkout[]);
    }
  }

  async function saveWorkout(workout: CloudWorkout) {
    setLoading(true);
    const result = await cloudDataService.saveWorkouts([{ ...workout, student_id: studentId || workout.student_id }]);
    setLoading(false);
    setMessage(result.message);

    if (result.ok) await loadWorkouts();
    return result;
  }

  useEffect(() => {
    loadWorkouts();
  }, [studentId]);

  return {
    workouts,
    loading,
    message,
    loadWorkouts,
    saveWorkout
  };
}
