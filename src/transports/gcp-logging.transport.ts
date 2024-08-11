import {ILogObject} from "tslog";
import {BaseTransport} from "./base.transport";
import {IOptions} from "./interfaces.transport";

export class GcpLoggingTransport extends BaseTransport {

  constructor(options: IOptions | undefined) {
    super(options);
  }

  getCurrentTraceFromAgent(): string | null {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const agent = (global as any)._google_trace_agent;
    if (!agent || !agent.getCurrentContextId || !agent.getWriterProjectId) {
      return null;
    }

    const traceId = agent.getCurrentContextId();
    if (!traceId) {
      return null;
    }

    const traceProjectId = agent.getWriterProjectId();
    if (!traceProjectId) {
      return null;
    }

    return `projects/${traceProjectId}/traces/${traceId}`;
  }

  buildLog(logObject: ILogObject) {
    const trace = this.getCurrentTraceFromAgent();
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
      trace,
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
