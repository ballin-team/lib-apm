import { ILogObject } from 'tslog';
import { IOptions } from './interfaces.transport';

export abstract class BaseTransport {
  requestId: () => string;

  constructor(protected options: IOptions | undefined) {
    this.requestId = () => '';
  }

  setRequestId(requestId: () => string) {
    this.requestId = requestId;
  }

  abstract save(logObject: ILogObject): void;
}
