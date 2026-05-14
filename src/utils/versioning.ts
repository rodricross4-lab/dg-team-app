export type VersionInfo = {
  version: string;
  codename: string;
  stage: 'alpha' | 'beta' | 'release';
  updatedAt: string;
};

export const currentVersion: VersionInfo = {
  version: '1.0.0-beta',
  codename: 'Gorilla Core',
  stage: 'beta',
  updatedAt: new Date().toISOString()
};

export function getVersionLabel(version: VersionInfo) {
  return `${version.version} • ${version.codename} • ${version.stage.toUpperCase()}`;
}
