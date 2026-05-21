import { useEffect } from 'react';
import { startAutoSync, stopAutoSync } from '../services/autoSync';

export default function AutoSyncBootstrap() {
  useEffect(() => {
    startAutoSync();
    return () => stopAutoSync();
  }, []);

  return null;
}
