/* eslint-disable no-console */
import { forkCatch, FutureInstance } from 'fluture';
import { identity } from 'io-ts';
import { AppErrorType } from '@app/errors';

function schedule(func: any, interval: number): () => void {
  return () => {
    func();
    setTimeout(schedule(func, interval), interval);
  };
}

export function scheduleFuture<E extends AppErrorType, A>(
  task: FutureInstance<E, A>,
  interval: number
): void {
  // TODO implement actual logging
  const handleErr = (err: Error) =>
    console.log(`schedule for future failed with err: ${err.message}`);
  const handleReject = (err: E) => console.log('schedule for future failed', JSON.stringify(err));

  const start = forkCatch(handleErr)(handleReject)(identity);
  schedule(() => start(task), interval)();
}
