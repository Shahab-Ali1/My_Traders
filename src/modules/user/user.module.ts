import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Media } from './entity/media.entity';
import { MediaService } from './service/media.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Media])],
  controllers: [UserController],
  providers: [UserService, MediaService],
  exports: [UserService, MediaService]
})
export class UserModule {}
