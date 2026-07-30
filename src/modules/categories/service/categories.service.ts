import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { MediaService } from 'src/modules/user/service/media.service';

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
    const create = this.repository.create(createCategoryDto)
    if (file) {
      const module = "user/categories"
      const media: any = await this.mediaService.uploadMedia(file, module, file.originalname, "profile");
      create.image_id = media.id;
    }
    const saved = await this.repository.save(create);
    return {
      data: saved
    }
  }

  findAll() {
    return `This action returns all categories`;
  }

  async findOne(id: number) {
    const category = this.repository.findOne({
      where: { id: id },
      relations:['image_id']
    })
    return category;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
