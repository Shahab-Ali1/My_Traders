import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor, UseGuards, UploadedFile, Query } from '@nestjs/common';

import { ApiBearerAuth, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/role.guard';
import { StoreService } from '../service/store.service';
import { CreateStoreDto } from '../dto/create-store.dto';

@Controller('Store')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(RolesGuard)
@ApiBearerAuth('token')
export class StoreController {
  constructor(private readonly service: StoreService) { }

  @Post('create')
  async create(
    @Body() createStoreDto: CreateStoreDto,
  ) {
    return await this.service.create(createStoreDto);
  }

}
