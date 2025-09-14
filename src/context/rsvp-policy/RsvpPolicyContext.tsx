import { createContext } from 'react';
import type { IRsvpPolicyData } from './IRsvpPolicyData';

export const RsvpPolicyContext = createContext<IRsvpPolicyData | null>(null);
