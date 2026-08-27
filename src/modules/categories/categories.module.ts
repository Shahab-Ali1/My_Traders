import { Module } from '@nestjs/common';
import { CategoriesController } from './controller/categories.controller';
import { CategoriesService } from './service/categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { Category } from './entity/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    UserModule
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService]
})
export class CategoriesModule { }
