import { Persistable } from './persistable';

export type Source = {
  name: string;
  url: string;
} & Persistable;
