import { ILogObject } from 'tslog';
import { CoralogixService } from '../services';
import { BaseTransport } from './base.transport';
import { IOptions } from './interfaces.transport';
import { Severity } from 'coralogix-logger';

export class CoralogixTransport extends BaseTransport {
  client: CoralogixService;

  constructor(options: IOptions) {
    super(options);
    this.client = new CoralogixService(options);
  }

  /**
   *  This method is used to add trace and send object to
   *  Coralogix logger API.
   */
  save(logObject: ILogObject): void {
    try {
      const message = this.client.buildLog(logObject);
      console.log(this.requestId(), 'aquiiiiiiiii');
      switch (logObject.logLevel) {
        case 'silly':
        case 'trace':
        case 'debug':
          this.client.sendLog({
            severity: Severity.debug,
            className: 'ConsoleLogger',
            methodName: 'logger',
            text: message,
          });
          break;
        case 'info':
          this.client.sendLog({
            severity: Severity.info,
            className: 'ConsoleLogger',
            methodName: 'logger',
            text: message,
          });
          break;
        case 'warn':
          this.client.sendLog({
            severity: Severity.warning,
            className: 'ConsoleLogger',
            methodName: 'logger',
            text: message,
          });
          break;
        case 'error':
          this.client.sendLog({
            severity: Severity.error,
            className: 'ConsoleLogger',
            methodName: 'logger',
            text: message,
          });
          break;
        case 'fatal':
          this.client.sendLog({
            severity: Severity.critical,
            className: 'ConsoleLogger',
            methodName: 'logger',
            text: message,
          });
          break;
      }
    } catch (e) {
      console.error(e);
    }
  }
}
