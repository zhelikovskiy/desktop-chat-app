import { DocumentBuilder } from '@nestjs/swagger';

const swaggerConfig = new DocumentBuilder()
	.setTitle('The Hearth API')
	.setDescription('Full API documentation for The Hearth project.')
	.setVersion('1.0')
	.addBearerAuth(
		{
			type: 'http',
			scheme: 'bearer',
			bearerFormat: 'JWT',
			name: 'Authorization',
			description: 'Enter JWT token',
			in: 'header',
		},
		'JWT-auth'
	)
	.addGlobalResponse({
		status: 500,
		description: 'Internal server error',
	})
	.build();

export default swaggerConfig;
