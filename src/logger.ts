import { DaviLogger } from '@npm-davi/davi-coe-tslog-nodejs-lib';
import { IMaskOptions } from '@npm-davi/davi-coe-tslog-nodejs-lib/interfaces';

export enum LoggerLevel {
  SILLY = 'silly',
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

export class Logger {
  readonly logger: DaviLogger;
  readonly level: LoggerLevel;

  private static instance: Logger = undefined;

  private constructor(
    name: string,
    cloudEnv?: boolean,
    level?: LoggerLevel,
    maskOptions?: IMaskOptions,
  ) {
    this.level = level ?? LoggerLevel.INFO;
    this.logger = new DaviLogger(
      cloudEnv ?? true,
      name,
      this.level,
      maskOptions,
      { colorized: true, type: 'pretty' },
      { uuidVersion: 4, maxSizeMsg: 15000 },
    );
  }

  static getInstance(loggerEnvironmentVariables: {
    name: string;
    cloudEnv: boolean;
    level: 'silly' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  }): Logger {
    if (!Logger.instance) {
      const { name, cloudEnv, level } = loggerEnvironmentVariables;
      Logger.instance = new Logger(name, cloudEnv, level as LoggerLevel);
    }

    return Logger.instance;
  }
}
