import { Persistable } from './persistable';

export type Link = {
  id: string;
  title: string;
  source: string;
  url: string;
  commentsUrl: string;
  commentsCount: number;
} & Persistable;
