import { TLogLevelName, ISettingsParam } from 'tslog';
import { IOptions } from '../transports';

export interface ILoggerSettingsTransport {
  provider: 'coralogix';
  minLevel?: TLogLevelName;
  enabled?: boolean;
  options: IOptions;
}

export interface ILoggerSettings extends ISettingsParam {
  transports?: ILoggerSettingsTransport[];
}
