import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3000;

  app.useGlobalPipes(new ValidationPipe());

  // const reflector = new Reflector();
  // app.useGlobalGuards(new AccessTokenGuard(reflector));

  await app.listen(PORT, () => {
    console.log(
      `Running NestJs REST API in MODE: ${process.env.NODE_ENV} on PORT: ${PORT}`,
    );
  });
}
bootstrap();
