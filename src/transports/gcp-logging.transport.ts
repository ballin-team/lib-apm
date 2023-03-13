import {ILogObject} from "tslog";
import {BaseTransport} from "./base.transport";
import {IOptions} from "./interfaces.transport";

export class GcpLoggingTransport extends BaseTransport {

  constructor(options: IOptions | undefined) {
    super(options);
  }

  buildLog(logObject: ILogObject) {
    return JSON.stringify({
      x_request_id: logObject.requestId,
      timestamp: logObject.date.toISOString(),
      sourceLocation: {
        file: logObject.filePath,
        line: String(logObject.lineNumber),
        function: logObject.functionName || logObject.methodName || 'anonymous',
      },
      textPayload: JSON.stringify(logObject.argumentsArray[0]),
      jsonPayload: logObject.toJSON(),
      severity: logObject.logLevel.toUpperCase(),
      message: logObject.toJSON(),
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
        console.debug(message);
        break;
    }
  }
}
