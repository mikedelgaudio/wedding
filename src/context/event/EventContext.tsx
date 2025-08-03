import { createContext } from 'react';
import type { IEventData } from './IEventData';

export const EventContext = createContext<IEventData | null>(null);
