import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards, ClassSerializerInterceptor, UploadedFile, Query } from '@nestjs/common';
import { ProductsService } from '../service/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/modules/user/entity/user.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/utility/file.util';
import * as path from 'path';
import * as fs from 'fs/promises';

@Controller('products')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('token')
export class ProductsController {
  constructor(private readonly service: ProductsService) { }

  @Post('create')
  @UseInterceptors(FileInterceptor('media', storage()))
  @ApiConsumes('multipart/form-data')
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User
  ) {
    try {
      return this.service.create(createProductDto, user, file);
    } catch (error) {
      if (file) {
        await fs.unlink(path.resolve(file.path)).catch(() => { });
      }

      throw error;
    }
  }

  @Get()
  @ApiQuery({ name: 'status', description: 'active or in-active categories', enum: ['active', 'inactive'], required: true })
  @ApiQuery({ name: 'page_number', required: false, type: Number, example: 1, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'page_size', required: false, type: Number, example: 10, description: 'Number of results per page (default: 10)' })
  findAll(
    @Query('status') status: 'active' | 'inactive',
    @Query('page_number') pageNumber: number = 1,
    @Query('page_size') pageSize: number = 10,
    @CurrentUser() user: User
  ) {
    return this.service.findAll(status, user, pageNumber, pageSize);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: User
  ) {
    return this.service.findOne(+id, user);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('media', storage()))
  @ApiConsumes('multipart/form-data')
  update(@Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User
  ) {
    return this.service.update(+id, updateProductDto, user, file);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: User
  ) {
    return this.service.remove(+id, user);
  }
}
