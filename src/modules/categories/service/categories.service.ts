import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { MediaService } from 'src/modules/user/service/media.service';
import { Flags } from 'src/utility/flags';
import { FlagsEnum } from 'src/common/constants/flags.enum';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    protected repository: Repository<Category>,
    protected mediaService: MediaService
  ) { }

  async create(createCategoryDto: CreateCategoryDto, file?: Express.Multer.File) {
    const category = await this.repository.findOne({
      where: { name: ILike(createCategoryDto.name) }
    });
    if (category) {
      throw new HttpException('Category already exist.', HttpStatus.CONFLICT);
    }
    const create = this.repository.create({
      name: createCategoryDto.name,
      description: createCategoryDto.description,
      flags: createCategoryDto.status ? 1 : 0
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

  async findAll(status, pageNumber: number = 1, pageSize: number = 10) {
    const offset = (pageNumber - 1) * pageSize;
    const [ getCategories, total ] = await this.repository.findAndCount({
      where: {
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

  async findOne(id: number) {
    const category = await this.repository.findOne({
      where: { id: id },
      relations: ['media']
    });

    if (!category) {
      throw new HttpException("category not found.", HttpStatus.NOT_FOUND)
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto, file: Express.Multer.File) {
    const category = await this.findOne(id);

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

  async remove(id: number) {
    const category = await this.findOne(id);
    if (category.media) {
      await this.mediaService.deleteMedia(category.media.id, category.media.key, category.media.name);
    }
    await this.repository.delete(id)
    return `Category deleted successfully`;
  }
}
