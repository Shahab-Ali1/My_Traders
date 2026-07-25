import 'dotenv/config';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import typeormConfigs from './typeorm.config';

ConfigModule.forRoot({
  isGlobal: true,
});

const paths = {
  entities: ['src/modules/**/entity/*.entity{.ts,.js}'],
  migrations: ['src/modules/**/database/migrations/*.ts'],
  seeds: ['src/modules/**/database/seeders/*.seed.ts'],
  factories: ['src/modules/**/database/factories/*.factory.ts'],
};


const options = {
  ...typeormConfigs(),
  migrations: paths.migrations,
};

export default new DataSource(options);
