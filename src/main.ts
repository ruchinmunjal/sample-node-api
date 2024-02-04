import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLoggerService } from './custom-logger/custom-logger.service';
import { AllExceptionsFilter } from './all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter))

  app.useLogger(app.get(CustomLoggerService));
  app.setGlobalPrefix('api');
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
