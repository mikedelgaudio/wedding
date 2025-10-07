import { createContext } from 'react';
import type { IRsvpContext } from './IRsvpContext';

export const RsvpContext = createContext<IRsvpContext | null>(null);