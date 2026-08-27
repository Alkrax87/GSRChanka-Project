export interface AuthUser {
  uid: string;
  username: string | null;
  displayName: string;
  role: 'SUPERADMIN' | 'BOSS' | 'OPERATOR' | string;
  dependenciaId: string;
}
