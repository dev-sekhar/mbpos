import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { RolesGuard } from './auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);

  // Apply AuthGuard('jwt') and RolesGuard globally, in correct order
  app.useGlobalGuards(
    new (AuthGuard('jwt') as any)(),  // Cast to any due to typing
    new RolesGuard(reflector),
  );

  await app.listen(3000);
}
bootstrap();
