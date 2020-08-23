import { FastifyReply, FastifyRequest, HTTPMethods } from 'fastify';
import { FutureInstance } from 'fluture';
import { AppError } from '@app/errors';

export enum RouteType {
  view = 'view',
  payload = 'payload',
}

type handlerParams = {
  body: unknown;
  params: unknown;
  queryParams: unknown;
  req: FastifyRequest;
  res: FastifyReply;
};

export type Route<A> = {
  method: HTTPMethods;
  url: string;
  handler: (params: handlerParams) => FutureInstance<AppError, A>;
  routeType: RouteType;
};
