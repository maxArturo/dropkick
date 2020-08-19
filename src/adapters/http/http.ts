import axios, { AxiosRequestConfig } from 'axios';
import { bimap, encaseP, FutureInstance } from 'fluture';
import { ErrorType, HttpErrorType } from '@app/errors';

export const http = (config: AxiosRequestConfig): FutureInstance<HttpErrorType, unknown> => {
  return encaseP((params: AxiosRequestConfig) => axios(params))(config).pipe(
    bimap(
      (err: unknown): HttpErrorType => ({
        type: ErrorType.http,
        message: `An error occurred while fetching ${config.url}`,
        errorCode: 502,
        metadata: { err },
      })
    )((res) => res.data)
  );
};
