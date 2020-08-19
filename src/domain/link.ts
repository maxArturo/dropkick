import { Persistable } from './persistable';

export type Link = {
  title: string;
  source: string;
  url: string;
  commentsUrl: string;
  commentsCount: number;
} & Persistable;
