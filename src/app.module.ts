import { Module } from '@nestjs/common';
import { shareModule } from './modules/sharemodule.module';
import { ConfigModule } from '@nestjs/config';
import { typeormConfigs } from './config/typeorm/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeormConfigs()),
    shareModule,
  ],
})
export class AppModule {}
