import * as t from 'io-ts';
import { FutureInstance, reject, resolve } from 'fluture';
import { AppError, ErrorType } from '@app/errors';
import { pipe } from 'fp-ts/lib/function';
import { fold, mapLeft } from 'fp-ts/Either';

type Validator = <A>(
  codec: t.Decoder<unknown, A>
) => (value: unknown) => FutureInstance<AppError, A>;

export const validateHttpResponse: (url: string) => Validator = (url) => (codec) =>
  createValidator(codec, (errors) => ({
    type: ErrorType.validation,
    message: 'Invalid response from upstream HTTP response',
    metadata: {
      url,
      errors: formatValidationErrors(errors),
    },
    errorCode: 502,
  }));

export const validateDbResult: (type: string) => Validator = (type) => (codec) =>
  createValidator(codec, (errors) => ({
    type: ErrorType.db,
    message: 'Database result does not conform to domain model',
    metadata: {
      type,
      errors: formatValidationErrors(errors),
    },
    errorCode: 500,
  }));

export function validateConfig<A>(codec: t.Decoder<unknown, A>, value: unknown): A {
  return pipe(
    value,
    codec.decode,
    fold(
      (errors) => {
        const configEntries = errors
          .map(({ context }) =>
            context.map(({ key, actual }) => (key ? `${key}:${actual}` : '')).join('')
          )
          .join('\n');

        throw new Error(
          `Invalid config for:\n(${codec.name}).\nThe following key/value pairs are invalid:\n${configEntries}\n`
        );
      },
      (result) => result
    )
  );
}

function createValidator<A>(
  codec: t.Decoder<unknown, A>,
  mapError: (errors: t.Errors) => AppError
): (value: unknown) => FutureInstance<AppError, A> {
  return (value: unknown) => {
    return pipe(
      codec.decode(value),
      mapLeft((err) => mapError(err)),
      fold<AppError, A, FutureInstance<AppError, A>>(reject, resolve)
    );
  };
}

function formatValidationErrors(errors: t.Errors): Array<string> {
  return errors.map(
    (err) =>
      `Invalid value \`${err.value}\` supplied to ${err.context.map(({ key }) => key).join('.')}`
  );
}
