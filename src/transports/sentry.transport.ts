import * as Sentry from "@sentry/node";
import {ILogObject, IStackFrame} from "tslog";
import {BaseTransport} from "./base.transport";
import {IOptions} from "./interfaces.transport";

export class SentryTransport extends BaseTransport {
  private sentry: any;

  constructor(options: IOptions) {
    super(options);
    this.sentry = Sentry;
  }

  build(message: object, level: string, stacktrace?:  IStackFrame[] | undefined) {
    this.sentry.addBreadcrumb({
      category: "logger",
      message: JSON.stringify(message, null, 2),
      level,
      ...(stacktrace ? { stacktrace } : {})
    });
  }

  buildLog(logObject: ILogObject) {
    return {
      x_request_id: logObject.requestId,
      path: `${logObject.filePath}:${logObject.lineNumber}`,
      event: logObject.functionName || logObject.methodName || 'anonymous',
      context: logObject.argumentsArray
    }
  }

  save(logObject: ILogObject): void {
    const message = this.buildLog(logObject);

    switch (logObject.logLevel) {
      case "silly":
      case "trace":
      case "debug":
        this.build(message, 'debug')
        break;
      case "info":
        this.build(message, 'info')
        break;
      case "warn":
        this.build(message, 'warn')
        break;
      case "error":
        this.build(message, 'error')
        break;
      case "fatal":
        // @ts-ignore
        Sentry.captureException(logObject.argumentsArray[0].nativeError);
        break;
    }
  }
}
