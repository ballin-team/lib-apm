import { CoralogixLogger, Log, LoggerConfig } from 'coralogix-logger';
import { ILogObject } from 'tslog';
import { IOptions } from '../transports';

export class CoralogixService {
  private coralogix: CoralogixLogger;

  constructor(options: IOptions) {
    this.coralogix = this.init(options);
  }

  init(options: IOptions) {
    CoralogixLogger.configure(
      new LoggerConfig({
        applicationName: options.applicationName,
        privateKey: options.privateKey,
        subsystemName: options.subsystemName,
      })
    );

    return new CoralogixLogger(options.category);
  }

  public buildLog(logObject: ILogObject) {
    return {
      x_request_id: logObject.requestId,
      event: logObject.functionName || logObject.methodName || 'anonymous',
      context: logObject.argumentsArray,
    };
  }

  public sendLog({ severity, className, methodName, text }: any): void {
    console.log(severity, className, methodName, text);
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
