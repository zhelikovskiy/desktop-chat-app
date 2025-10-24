import { transports, format } from 'winston';
import { WinstonModule } from 'nest-winston';

export const winstonLogger = WinstonModule.createLogger({
	transports: [
		new transports.Console({
			format: format.combine(
				format.timestamp(),
				format.ms(),
				format.colorize({ all: true }),
				format.printf(
					(info) =>
						`${info.timestamp} [${info.level}] ${info.message}`
				)
			),
		}),
		new transports.File({
			filename: 'error.log',
			level: 'error',
			format: format.combine(format.timestamp(), format.json()),
		}),

		new transports.File({
			filename: 'combined.log',
			format: format.combine(format.timestamp(), format.json()),
		}),
	],
});
