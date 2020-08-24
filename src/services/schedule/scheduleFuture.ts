/* eslint-disable no-console */
import { forkCatch, FutureInstance } from 'fluture';
import { AppError } from '@app/errors';
import { log } from '@app/util/log';

export function scheduleFuture<E extends AppError, A>(
  task: FutureInstance<E, A>,
  interval: number
): void {
  const start = forkCatch(handleErr)(handleReject)(handleResolve);

  function handleErr(err: Error) {
    log.error(`schedule for future failed with err: ${err.message}`);
    setTimeout(() => start(task), interval);
  }
  function handleReject(err: E) {
    log.error('schedule for future failed', JSON.stringify(err));
    setTimeout(() => start(task), interval);
  }
  function handleResolve() {
    log.info('schedule for future succeeded');
    setTimeout(() => start(task), interval);
  }

  start(task);
}
