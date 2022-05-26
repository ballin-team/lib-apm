import { BaseTransport } from '../transports/base.transport';
import { Logger as TsLogger, ISettingsParam } from 'tslog';
import { Request, Response, NextFunction } from 'express';
import { asyncContextBlock, contextBlock, contextMiddleware, get, set } from '../contex';
import { ILoggerSettings } from './interfaces.logger';
import { CoralogixTransport } from '../transports';

/**
 * 📝 Robust logger with custom transports for APM (Application Performance Monitoring)
 * @public
 */
export class Logger extends TsLogger {
  private loggerSetting: ILoggerSettings;
  private readonly transports: BaseTransport[];

  constructor(settings: ILoggerSettings) {
    super(settings);
    this.loggerSetting = settings;
    this.transports = [];
    this.initTransports();
  }

  /**
   *  This private method is used to initialize transport
   *  received from the constructor settings
   *
   * @param transport - Custom class extended from BaseTransport.
   * @param settings - Object with all logger preferences
   */
  private initTransport(transport: BaseTransport, settings: ISettingsParam) {
    this.attachTransport(
      {
        silly: transport.save.bind(transport),
        debug: transport.save.bind(transport),
        trace: transport.save.bind(transport),
        info: transport.save.bind(transport),
        warn: transport.save.bind(transport),
        error: transport.save.bind(transport),
        fatal: transport.save.bind(transport),
      },
      settings.minLevel
    );

    this.transports.push(transport);
  }

  /**
   *  This private method is used to initialize each enabled transport
   *  received from the constructor settings
   */
  private initTransports() {
    if (this.loggerSetting.transports) {
      this.loggerSetting.transports.forEach((item) => {
        if (item.enabled) {
          switch (item.provider) {
            case 'coralogix':
              this.initTransport(new CoralogixTransport(item.options), item);
              break;
          }
        }
      });
    }
  }

  /**
   *  This method is used as an express middleware
   *  for create a context by each request.
   *  **Must be the first middleware**
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next object.
   */
  public setContextMiddleware(req: Request, res: Response, next: NextFunction) {
    return contextMiddleware(req, res, next);
  }

  /**
   *  This method is used for create a code block of context
   *  and all executions inside this method is in the same context
   *
   * @param block - Code block that need context.
   */
  public setContextBlock(block: () => void) {
    return contextBlock(block);
  }

  /**
   *  This method is used for create a code block of context
   *  and all executions inside this method is in the same context
   *  **==>ONLY FOR ASYNC CODE BLOCK<==**
   * @param block - Async Code block that need context.
   */
  public setAsyncContextBlock(block: () => Promise<void>) {
    return asyncContextBlock(block);
  }

  /**
   *  This method is used for get requestId
   *  in the current context
   */
  public getRequestId(): string {
    return get('requestId');
  }

  /**
   *  This method is used for set a new requestId in the context
   * @param requestId - string as unique identifier for request.
   */
  public setRequestId(requestId: string) {
    if (requestId) {
      set('requestId', requestId);
      this.settings.requestId = () => get('requestId');
      this.setSettings({ ...this.settings, requestId: () => get('requestId') });
      for (const transport of this.transports) {
        transport.setRequestId(() => get('requestId'));
      }
    }
  }
}
