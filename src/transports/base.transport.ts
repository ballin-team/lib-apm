import { ILogObject } from 'tslog';
import { IOptions } from './interfaces.transport';

export abstract class BaseTransport {
  requestId: () => string;
  data: () => unknown;

  constructor(protected options: IOptions | undefined) {
    this.requestId = () => '';
    this.data = () => {};
  }

  setRequestId(requestId: () => string) {
    this.requestId = requestId;
  }

  setData(data: () => unknown) {
    this.data = data;
  }

  abstract save(logObject: ILogObject): void;
}
