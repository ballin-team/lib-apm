import * as cls from 'cls-hooked';
import { NextFunction, Request, Response } from 'express';

const nsid = 'd3d9c98c-474b-4f74-a81f-243839f53c9a';
const ns = cls.createNamespace(nsid);

/**
 *  This function is used as an express middleware
 *  for create a context by each request.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next object.
 */
export const contextMiddleware = (req: Request, res: Response, next: NextFunction) => {
  ns.run(() => next());
};

/**
 *  This function is used for get a value by key
 *  in the current context
 *
 *  @param key - key is a unique identifier.
 */
export const get = (key: string) => {
  if (ns && ns.active) {
    return ns.get(key);
  }
};

/**
 *  This function is used for set a key and value
 *  in the current context
 *
 *  @param key - key is a unique identifier.
 *  @param value - storage data.
 */
export const set = (key: string, value: unknown) => {
  if (ns && ns.active) {
    return ns.set(key, value);
  }
  return undefined;
};

/**
 *  This function is used for create a code block of context
 *  and all executions inside this method is in the same context
 *
 * @param block - Code block that need context.
 */
export const contextBlock = (block: () => void) => {
  return ns.run(block);
};

/**
 *  This function is used for create a code block of context
 *  and all executions inside this method is in the same context
 *  **==>ONLY FOR ASYNC CODE BLOCK<==**
 * @param block - Async Code block that need context.
 */
export const asyncContextBlock = (block: () => Promise<void>) => {
  return ns.runPromise(block);
};
