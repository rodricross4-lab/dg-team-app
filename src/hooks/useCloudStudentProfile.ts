import { useEffect, useState } from 'react';
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

  async function loadProfile() {
    if (!studentId) return;
    setLoading(true);

    const [workoutResult, sessionResult, logbookResult, assessmentResult, checkinResult, timelineResult, insightResult] = await Promise.all([
      cloudDataService.getWorkouts(studentId),
      cloudDataService.getWorkoutSessions(studentId),
      cloudDataService.getLogbook(studentId),
      cloudDataService.getAssessments(studentId),
      cloudDataService.getCheckins(studentId),
      cloudDataService.getTimeline(studentId),
      cloudDataService.getInsights(studentId)
    ]);

    setLoading(false);
    setMessage('Perfil cloud carregado.');

    if (workoutResult.ok && Array.isArray(workoutResult.data)) setWorkouts(workoutResult.data);
    if (sessionResult.ok && Array.isArray(sessionResult.data)) setSessions(sessionResult.data);
    if (logbookResult.ok && Array.isArray(logbookResult.data)) setLogbook(logbookResult.data);
    if (assessmentResult.ok && Array.isArray(assessmentResult.data)) setAssessments(assessmentResult.data);
    if (checkinResult.ok && Array.isArray(checkinResult.data)) setCheckins(checkinResult.data);
    if (timelineResult.ok && Array.isArray(timelineResult.data)) setTimeline(timelineResult.data);
    if (insightResult.ok && Array.isArray(insightResult.data)) setInsights(insightResult.data);
  }

  useEffect(() => {
    loadProfile();
  }, [studentId]);

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
