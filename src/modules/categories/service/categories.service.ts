import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Category } from '../entity/category.entity';
import { MediaService } from 'src/modules/user/service/media.service';
import { Flags } from 'src/utility/flags';
import { FlagsEnum } from 'src/common/constants/flags.enum';
import { User } from 'src/modules/user/entity/user.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    protected repository: Repository<Category>,
    protected mediaService: MediaService
  ) { }

  async create(createCategoryDto: CreateCategoryDto, user: User, file?: Express.Multer.File) {
    const category = await this.repository.findOne({
      where: {
        name: ILike(createCategoryDto.name),
        storeId: user.storeId as number}
    });
    if (category) {
      throw new HttpException('Category already exist.', HttpStatus.CONFLICT);
    }
    const create = this.repository.create({
      name: createCategoryDto.name,
      description: createCategoryDto.description,
      flags: createCategoryDto.status ? 1 : 0,
      storeId: user.storeId as number
    })
    if (file) {
      const module = "user/categories"
      const media: any = await this.mediaService.uploadMedia(file, module, file.originalname, "category");
      create.media = media.id;
    }
    const saved = await this.repository.save(create);
    return {
      data: saved
    }
  }

  async findAll(status, user, pageNumber: number = 1, pageSize: number = 10) {
    const offset = (pageNumber - 1) * pageSize;
    const [getCategories, total] = await this.repository.findAndCount({
      where: {
        storeId: user.storeId,
        flags: status === 'active' ? FlagsEnum.ACTIVE : FlagsEnum.IN_ACTIVE
      },
      relations: ['media'],
      skip: offset,
      take: pageSize
    });

    return {
      data: getCategories,
      total: total,
      query: {
        page_number: pageNumber,
        page_size: pageSize,
      }
    };
  }

  async findOne(id: number, user: User) {
    const category = await this.repository.findOne({
      where: {
        id: id,
        storeId: user.storeId as number
      },
      relations: ['media']
    });

    if (!category) {
      throw new HttpException("category not found.", HttpStatus.NOT_FOUND)
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto, user: User, file?: Express.Multer.File) {
    const category = await this.findOne(id, user);

    if (file) {
      if (category.media) {
        await this.mediaService.deleteMedia(category.media.id, category.media.key, category.media.name);
      }
      // upload new media
      const module = "user/categories"
      const media: any = await this.mediaService.uploadMedia(file, module, file.originalname, "profile");
      category.media = media.id;
    }
    await this.repository.update(category.id, {
      ...category,
      name: updateCategoryDto.name,
      description: updateCategoryDto.description,
      flags: updateCategoryDto.status ? 1 : 0,
    });
    return "Category updated successfully";
  }

  async remove(id: number, user: User) {
    const category = await this.findOne(id, user);
    if (category.media) {
      await this.mediaService.deleteMedia(category.media.id, category.media.key, category.media.name);
    }
    await this.repository.delete(id)
    return `Category deleted successfully`;
  }
}
