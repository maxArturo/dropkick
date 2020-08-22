import axios, { AxiosRequestConfig } from 'axios';
import { bimap, encaseP, FutureInstance } from 'fluture';
import { ErrorType, HttpError } from '@app/errors';

export const http = (config: AxiosRequestConfig): FutureInstance<HttpError, unknown> => {
  return encaseP((params: AxiosRequestConfig) => axios(params))(config).pipe(
    bimap(
      (err: unknown): HttpError => ({
        type: ErrorType.http,
        message: `An error occurred while fetching ${config.url}`,
        errorCode: 502,
        metadata: { err },
      })
    )((res) => res.data)
  );
};
