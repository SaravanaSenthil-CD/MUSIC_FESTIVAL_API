import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, transports, format, Logger } from 'winston';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private logger: Logger;
  constructor() {
    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.json(),
        format.prettyPrint(),
      ),
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.timestamp(),
            format.simple(),
          ),
        }),
        new transports.File({ filename: 'logs/app.log' }),
      ],
    });
  }
  log(message: any, context?: string) {
    this.logger.info(message, { context });
  }
  error(message: any, trace?: string, context?: string) {
    this.logger.error(message, { context, trace });
  }
  warn(message: any, context?: string) {
    this.logger.warn(message, { context });
  }
  debug(message: any, context?: string) {
    this.logger.debug(message, { context });
  }
}
