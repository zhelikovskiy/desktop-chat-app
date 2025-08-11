import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import GlobalExceptionsFilter from './utils/global-exceptions.filter';
import { SwaggerModule } from './swagger/swagger.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		})
	);

	app.useGlobalFilters(new GlobalExceptionsFilter());

	SwaggerModule.setup(app);

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
