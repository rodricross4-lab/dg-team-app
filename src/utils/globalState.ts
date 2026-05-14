export type GlobalAppState = {
  initialized: boolean;
  lastSync?: string;
  offlineMode: boolean;
  version: string;
};

export const initialGlobalState: GlobalAppState = {
  initialized: true,
  offlineMode: false,
  version: '1.0.0-beta'
};

export function updateLastSync(state: GlobalAppState): GlobalAppState {
  return {
    ...state,
    lastSync: new Date().toISOString()
  };
}

export function toggleOfflineMode(state: GlobalAppState): GlobalAppState {
  return {
    ...state,
    offlineMode: !state.offlineMode
  };
}
