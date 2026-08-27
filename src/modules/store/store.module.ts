import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreService } from './service/store.service';
import { StoreController } from './controller/store.controller';
import { Store } from './entity/store.entity';
import { User } from '../user/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Store]),
  ],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService]
})
export class StoreModule { }
