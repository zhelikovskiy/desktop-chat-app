import { Module } from '@nestjs/common';
import { SwaggerModule as NestSwaggerModule } from '@nestjs/swagger';
import swaggerConfig from './swagger.config';

@Module({})
export class SwaggerModule {
	static setup(app) {
		const document = NestSwaggerModule.createDocument(app, swaggerConfig);

		NestSwaggerModule.setup('api-docs', app, document);
	}
}
