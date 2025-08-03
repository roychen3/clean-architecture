type LockAsyncFunction<T extends unknown[], R> = (...args: T) => Promise<R>;

/**
 * Wraps an async function to ensure only one execution at a time.
 * Subsequent calls while locked will wait for the current execution to complete
 * and receive the same result.
 */
export function lockAsyncFn<T extends unknown[], R>(
  fn: LockAsyncFunction<T, R>,
): LockAsyncFunction<T, R> {
  let locked = false;
  let queue: {
    resolve: (value: R) => void;
    reject: (reason: unknown) => void;
  }[] = [];

  const processQueue = (error: unknown, value?: R) => {
    queue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(value!);
      }
    });

    queue = [];
  };

  return async (...args: T): Promise<R> => {
    if (locked) {
      return new Promise<R>((resolve, reject) => {
        queue.push({ resolve, reject });
      });
    }

    locked = true;
    return new Promise<R>((resolve, reject) => {
      fn(...args)
        .then((data) => {
          processQueue(null, data);
          resolve(data);
        })
        .catch((err) => {
          processQueue(err);
          reject(err);
        })
        .finally(() => {
          locked = false;
        });
    });
  };
}
