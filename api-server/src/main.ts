import { Logger } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { CatchEverythingFilter } from './filters/catch-everything.filter';
import { SystemInitializationService } from './modules/system/system-initialization.service';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule, {
      cors: {
        origin: 'http://localhost:5173',
        credentials: true,
      },
    });
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    const httpAdapter = app.get(HttpAdapterHost);
    app.useGlobalFilters(new CatchEverythingFilter(httpAdapter));

    // Run system initialization check
    const systemInitService = app.get(SystemInitializationService);
    await systemInitService.checkSystemInitialization();

    const config = new DocumentBuilder()
      .setTitle('Blog')
      .setDescription('The blog API description')
      .setVersion('1.0')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, documentFactory);

    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    logger.log(`Application is running on: http://localhost:${port}`);
  } catch (error) {
    logger.error('Error starting the application:', error.message);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  const logger = new Logger('BootstrapError');
  logger.error('Error bootstrapping the application:', error);
});
