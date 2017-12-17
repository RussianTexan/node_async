
import * as exp from 'express';

export type HandlerAsync = (req: exp.Request, res: exp.Response, next: exp.NextFunction) => Promise<void>;

export class Th {

  static wrap(fn: HandlerAsync) {
    return (req: exp.Request, res: exp.Response, next: exp.NextFunction) => {
      return Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  static async toDelayedPromise<T>(func: () => T, delay: number): Promise<T> {
    return new Promise<T>((
      resolve: (value: T) => void,
      reject: (reason: Error) => void
    ) => {
      setTimeout(() => {
        try {
          const result: T = func();
          resolve(result);
        } catch (err) {
          reject(err);
        }
      }, delay);
    });
  }

  static toDelayedCallback(resolve: () => void, reject: (err: any) => void, delay: number): void {
    setTimeout(() => {
      try {
        resolve();
      } catch (err) {
        reject(err);
      }
    }, delay);
  }
}
