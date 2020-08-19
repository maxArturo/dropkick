import * as t from 'io-ts';
import { FutureInstance, reject, resolve } from 'fluture';
import { ErrorType, ValidationErrorType } from '@app/errors';
import { pipe } from 'fp-ts/lib/function';
import { fold, mapLeft } from 'fp-ts/Either';

type Validator = <A>(
  codec: t.Decoder<unknown, A>
) => (value: unknown) => FutureInstance<ValidationErrorType, A>;

function createValidator<A>(
  codec: t.Decoder<unknown, A>,
  mapError: (errors: t.Errors) => ValidationErrorType
): (value: unknown) => FutureInstance<ValidationErrorType, A> {
  return (value: unknown) => {
    return pipe(
      codec.decode(value),
      mapLeft((err) => mapError(err)),
      fold<ValidationErrorType, A, FutureInstance<ValidationErrorType, A>>(reject, resolve)
    );
  };
}

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

function formatValidationErrors(errors: t.Errors): Array<string> {
  return errors.map(
    (err) =>
      `Invalid value \`${err.value}\` supplied to ${err.context.map(({ key }) => key).join('.')}`
  );
}
