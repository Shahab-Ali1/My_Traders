import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from '../entity/store.entity';
import { ILike, Repository } from 'typeorm';
import { CreateStoreDto } from '../dto/create-store.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    protected repository: Repository<Store>,
  ) { }

  async create(createStoreDto: CreateStoreDto) {
    const store = await this.repository.findOne({
      where: { name: ILike(createStoreDto.name) }
    });
    if (store) {
      throw new HttpException('store already exist.', HttpStatus.CONFLICT);
    }
    const newStore = this.repository.create(createStoreDto);
    return await this.repository.save(newStore);
  }

}
