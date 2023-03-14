import {ILogObject} from "tslog";
import {BaseTransport} from "./base.transport";
import {IOptions} from "./interfaces.transport";

export class GcpLoggingTransport extends BaseTransport {

  constructor(options: IOptions | undefined) {
    super(options);
  }

  buildLog(logObject: ILogObject) {
    return JSON.stringify({
      severity: logObject.logLevel.toUpperCase(),
      message: typeof logObject.argumentsArray[0] === 'string' ? logObject.argumentsArray[0] : JSON.stringify(logObject.argumentsArray[0]),
      data: logObject.argumentsArray,
      x_request_id: logObject.requestId || 'INTERNAL',
      sourceLocation: {
        file: logObject.filePath,
        line: String(logObject.lineNumber),
        function: logObject.functionName || logObject.methodName || 'anonymous',
      },
    });
  }

  save(logObject: ILogObject): void {
    const message = this.buildLog(logObject);

    switch (logObject.logLevel) {
      case "silly":
      case "trace":
      case "debug":
        console.debug(message);
        break;
      case "info":
        console.info(message);
        break;
      case "warn":
        console.warn(message);
        break;
      case "error":
        console.error(message);
        break;
      case "fatal":
        console.error(message);
        break;
    }
  }
}
