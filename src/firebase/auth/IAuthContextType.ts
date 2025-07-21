import type { User } from 'firebase/auth';

export interface IAuthContextType {
  user: User | null;
  checking: boolean;
  signOutUser: () => Promise<void>;
}
