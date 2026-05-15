import { useCallback, useEffect, useState } from 'react';
import { cloudDataService } from '../services/cloudDataService';

export type CloudWorkout = {
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

  const loadWorkouts = useCallback(async () => {
    if (!studentId) {
      setWorkouts([]);
      setMessage('Aluno não selecionado para carregar treinos cloud.');
      return;
    }

    setLoading(true);
    try {
      const result = await cloudDataService.getWorkouts(studentId);
      setMessage(result.message);

      if (result.ok && Array.isArray(result.data)) {
        setWorkouts(result.data as CloudWorkout[]);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erro inesperado ao carregar treinos cloud.');
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  const saveWorkout = useCallback(async (workout: CloudWorkout) => {
    const targetStudentId = studentId || workout.student_id;

    if (!targetStudentId) {
      const result = { ok: false, message: 'Aluno não selecionado para salvar treino cloud.' };
      setMessage(result.message);
      return result;
    }

    setLoading(true);
    try {
      const result = await cloudDataService.saveWorkouts([{ ...workout, student_id: targetStudentId }]);
      setMessage(result.message);

      if (result.ok) await loadWorkouts();
      return result;
    } catch (error) {
      const result = {
        ok: false,
        message: error instanceof Error ? error.message : 'Erro inesperado ao salvar treino cloud.'
      };
      setMessage(result.message);
      return result;
    } finally {
      setLoading(false);
    }
  }, [loadWorkouts, studentId]);

  useEffect(() => {
    void loadWorkouts();
  }, [loadWorkouts]);

  return {
    workouts,
    loading,
    message,
    loadWorkouts,
    saveWorkout
  };
}
