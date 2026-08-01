import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import config from './config/swagger/swagger.config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { bootstrapApp } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // swagger validaton configuration
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //     transform: true,
  //   }),
  // );

  // For Exclude and more in entities
  // app.useGlobalInterceptors(
  //   new ClassSerializerInterceptor(
  //     app.get(Reflector)
  //   )
  // );

  // swagger configuration
  // const documentFactory = () => SwaggerModule.createDocument(app, config);
  // app.setGlobalPrefix('api/v1');
  // SwaggerModule.setup('/', app, documentFactory, {
  //   swaggerOptions: {
  //     defaultModelsExpandDepth: -1, // Hides Schemas section
  //   },
  // });

  
  bootstrapApp(app);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
