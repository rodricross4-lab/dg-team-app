import { useCallback, useEffect, useState } from 'react';
import { cloudDataService } from '../services/cloudDataService';

export type CloudStudent = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  goal?: string;
  phase?: string;
  frequency?: number;
  status?: string;
  priority?: string[];
};

export function useCloudStudents() {
  const [students, setStudents] = useState<CloudStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Cloud students não iniciado.');

  const loadStudents = useCallback(async () => {
    setLoading(true);

    try {
      const result = await cloudDataService.getStudents();
      setMessage(result.message);

      if (result.ok && Array.isArray(result.data)) {
        setStudents(result.data as CloudStudent[]);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erro inesperado ao carregar alunos cloud.');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveStudents = useCallback(async (rows: CloudStudent[]) => {
    if (!rows.length) {
      const result = { ok: false, message: 'Nenhum aluno informado para salvar.' };
      setMessage(result.message);
      return result;
    }

    setLoading(true);

    try {
      const result = await cloudDataService.saveStudents(rows);
      setMessage(result.message);

      if (result.ok) await loadStudents();
      return result;
    } catch (error) {
      const result = {
        ok: false,
        message: error instanceof Error ? error.message : 'Erro inesperado ao salvar alunos cloud.'
      };
      setMessage(result.message);
      return result;
    } finally {
      setLoading(false);
    }
  }, [loadStudents]);

  useEffect(() => {
    void loadStudents();
  }, [loadStudents]);

  return {
    students,
    loading,
    message,
    loadStudents,
    saveStudents
  };
}
