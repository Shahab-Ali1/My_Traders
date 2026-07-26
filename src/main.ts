import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import config from './config/swagger/swagger.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // swagger validaton configuration
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // swagger configuration
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  app.setGlobalPrefix('api/v1');
  SwaggerModule.setup('/', app, documentFactory, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1, // Hides Schemas section
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
