import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor, UseGuards, UploadedFile, Query } from '@nestjs/common';
import { CategoriesService } from '../service/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { ApiBearerAuth, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/utility/file.util';
import * as path from 'path';
import * as fs from 'fs/promises';

@Controller('categories')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('token')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post('create')
  @UseInterceptors(FileInterceptor('media', storage()))
  @ApiConsumes('multipart/form-data')
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    try {
      return await this.categoriesService.create(createCategoryDto, file);
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
  ) {
    return this.categoriesService.findAll(status, pageNumber, pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('media', storage()))
  @ApiConsumes('multipart/form-data')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    try {
      return this.categoriesService.update(+id, updateCategoryDto, file);
    } catch (error) {
      if (file) {
        await fs.unlink(path.resolve(file.path)).catch(() => { });
      }

      throw error;
    }
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ) {
    return await this.categoriesService.remove(+id);
  }
}
