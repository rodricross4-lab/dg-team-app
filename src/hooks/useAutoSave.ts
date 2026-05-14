import { useEffect } from 'react';
import { saveToStorage } from '../utils/storage';

export function useAutoSave<T>(key: string, value: T) {
  useEffect(() => {
    saveToStorage(key, value);
  }, [key, value]);
}
