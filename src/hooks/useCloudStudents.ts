import { useEffect, useState } from 'react';
import { cloudDataService } from '../services/cloudDataService';

type CloudStudent = {
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

  async function loadStudents() {
    setLoading(true);
    const result = await cloudDataService.getStudents();
    setLoading(false);
    setMessage(result.message);

    if (result.ok && Array.isArray(result.data)) {
      setStudents(result.data as CloudStudent[]);
    }
  }

  async function saveStudents(rows: CloudStudent[]) {
    setLoading(true);
    const result = await cloudDataService.saveStudents(rows);
    setLoading(false);
    setMessage(result.message);

    if (result.ok) await loadStudents();
    return result;
  }

  useEffect(() => {
    loadStudents();
  }, []);

  return {
    students,
    loading,
    message,
    loadStudents,
    saveStudents
  };
}
