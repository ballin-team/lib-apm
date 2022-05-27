import { CoralogixLogger, Log, LoggerConfig } from 'coralogix-logger';
import { ILogObject } from 'tslog';
import { IOptions } from '../transports';

export class CoralogixService {
  private coralogix: CoralogixLogger;

  constructor(options: IOptions | undefined) {
    this.coralogix = this.init(options);
  }

  init(options: IOptions | undefined) {
    CoralogixLogger.configure(
      new LoggerConfig({
        applicationName: options?.applicationName,
        privateKey: options?.privateKey,
        subsystemName: options?.subsystemName,
      })
    );

    return new CoralogixLogger(options?.category || 'undefined');
  }

  public buildLog(logObject: ILogObject) {
    return {
      x_request_id: logObject.requestId,
      event: logObject.functionName || logObject.methodName || 'anonymous',
      path: logObject.filePath || null,
      context: logObject.argumentsArray,
    };
  }

  public sendLog({ severity, className, methodName, text }: any): void {
    return this.coralogix.addLog(
      new Log({
        severity,
        className,
        methodName,
        text,
      })
    );
  }
}
