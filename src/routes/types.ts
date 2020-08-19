import { HTTPMethods } from 'fastify';
import { FutureInstance } from 'fluture';
import { AppErrorType } from '@app/errors';

type handlerParams = {
  body: unknown;
  params: unknown;
  queryParams: unknown;
};

export type Route<A> = {
  method: HTTPMethods;
  url: string;
  handler: (params: handlerParams) => FutureInstance<AppErrorType, A>;
};
