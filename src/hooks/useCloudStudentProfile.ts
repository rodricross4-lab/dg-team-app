import { useCallback, useEffect, useState } from 'react';
import { cloudDataService } from '../services/cloudDataService';

export function useCloudStudentProfile(studentId?: string) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Perfil cloud não iniciado.');
  const [workouts, setWorkouts] = useState<unknown[]>([]);
  const [sessions, setSessions] = useState<unknown[]>([]);
  const [logbook, setLogbook] = useState<unknown[]>([]);
  const [assessments, setAssessments] = useState<unknown[]>([]);
  const [checkins, setCheckins] = useState<unknown[]>([]);
  const [timeline, setTimeline] = useState<unknown[]>([]);
  const [insights, setInsights] = useState<unknown[]>([]);

  const resetProfile = useCallback(() => {
    setWorkouts([]);
    setSessions([]);
    setLogbook([]);
    setAssessments([]);
    setCheckins([]);
    setTimeline([]);
    setInsights([]);
  }, []);

  const loadProfile = useCallback(async () => {
    if (!studentId) {
      resetProfile();
      setMessage('Aluno não selecionado para carregar perfil cloud.');
      return;
    }

    setLoading(true);

    try {
      const [workoutResult, sessionResult, logbookResult, assessmentResult, checkinResult, timelineResult, insightResult] = await Promise.all([
        cloudDataService.getWorkouts(studentId),
        cloudDataService.getWorkoutSessions(studentId),
        cloudDataService.getLogbook(studentId),
        cloudDataService.getAssessments(studentId),
        cloudDataService.getCheckins(studentId),
        cloudDataService.getTimeline(studentId),
        cloudDataService.getInsights(studentId)
      ]);

      if (workoutResult.ok && Array.isArray(workoutResult.data)) setWorkouts(workoutResult.data);
      if (sessionResult.ok && Array.isArray(sessionResult.data)) setSessions(sessionResult.data);
      if (logbookResult.ok && Array.isArray(logbookResult.data)) setLogbook(logbookResult.data);
      if (assessmentResult.ok && Array.isArray(assessmentResult.data)) setAssessments(assessmentResult.data);
      if (checkinResult.ok && Array.isArray(checkinResult.data)) setCheckins(checkinResult.data);
      if (timelineResult.ok && Array.isArray(timelineResult.data)) setTimeline(timelineResult.data);
      if (insightResult.ok && Array.isArray(insightResult.data)) setInsights(insightResult.data);

      setMessage('Perfil cloud carregado.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erro inesperado ao carregar perfil cloud.');
    } finally {
      setLoading(false);
    }
  }, [resetProfile, studentId]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  return {
    loading,
    message,
    workouts,
    sessions,
    logbook,
    assessments,
    checkins,
    timeline,
    insights,
    loadProfile
  };
}
