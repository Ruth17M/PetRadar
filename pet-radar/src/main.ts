import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

// Cargar .env desde la carpeta del proyecto (funciona si ejecutas desde pet-radar o desde la raíz)
const envPaths = [
  join(process.cwd(), '.env'),
  join(process.cwd(), 'pet-radar', '.env'),
];
for (const envPath of envPaths) {
  const result = dotenv.config({ path: envPath });
  if (result.parsed && Object.keys(result.parsed).length > 0) break;
}

async function bootstrap() {
  if (!process.env.MAILER_EMAIL || !process.env.MAILER_PASSWORD) {
      console.warn(
        'Aviso: Correo no configurado',
    );
  }
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
