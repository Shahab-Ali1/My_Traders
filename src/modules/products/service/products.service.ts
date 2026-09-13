import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entity/product.entity';
import { ILike, Not, Repository } from 'typeorm';
import { User } from 'src/modules/user/entity/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    protected repository: Repository<Product>

  ) { }
  async create(createProductDto: CreateProductDto, user: User, media?: Express.Multer.File) {
    const productExists = await this.repository.findOne({
      where: {
        name: ILike(createProductDto.name),
        storeId: user.storeId as number
      }
    });
    if (productExists) {
      throw new HttpException('Product already exist.', HttpStatus.CONFLICT);
    }

    const create = this.repository.create({
      categoryId: createProductDto.category_id,
      storeId: user.storeId as number,
      name: createProductDto.name,
      description: createProductDto.description,
      purchasePrice: createProductDto.purchase_price,
      salePrice: createProductDto.sale_price,
      stock: createProductDto.stock,
      flags: createProductDto.status ? 1 : 0,
    });

    return await this.repository.save(create);
  }

  async findAll(status: 'active' | 'inactive', user: User, pageNumber: number = 1, pageSize: number = 10) {
    const offset = (pageNumber - 1) * pageSize;
    const [getProducts, total] = await this.repository.findAndCount({
      where: {
        storeId: user.storeId as number,
        flags: status === 'active' ? 1 : 0
      },
      skip: offset,
      take: pageSize
    });

    return {
      data: getProducts,
      total: total,
      query: {
        page_number: pageNumber,
        page_size: pageSize,
      }
    };
  }

  async findOne(id: number, user: User) {
    const product = await this.repository.findOne({
      where: {
        id: id,
        storeId: user.storeId as number
      },
      relations: ['category']
    });

    if (!product) {
      throw new HttpException('Product not found.', HttpStatus.NOT_FOUND);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto, user: User, media?: Express.Multer.File) {
    // Check if the product exists
    const product = await this.repository.findOne({
      where: {
        id: id,
        storeId: user.storeId as number
      }
    });
    if (!product) {
      throw new HttpException('Product not found.', HttpStatus.NOT_FOUND);
    }
    // Check if the updated name already exists for another product in the same store
    const existingProduct = await this.repository.findOne({
      where: {
        name: ILike(updateProductDto.name),
        storeId: user.storeId as number,
        id: Not(id)
      }
    });
    if (existingProduct) {
      throw new HttpException('This product already exists.', HttpStatus.CONFLICT);
    }

    // Update the product
    await this.repository.update(id, {
      ...product,
      categoryId: updateProductDto.category_id,
      name: updateProductDto.name,
      description: updateProductDto.description,
      purchasePrice: updateProductDto.purchase_price,
      salePrice: updateProductDto.sale_price,
      stock: updateProductDto.stock,
      flags: updateProductDto.status ? 1 : 0,
    });

    return await this.repository.findOne({
      where: {
        id: id,
        storeId: user.storeId as number
      }
    });

  }

  async remove(id: number, user: User) {
    const product = await this.repository.findOne({
      where: {
        id: id,
        storeId: user.storeId as number
      }
    });
    if (!product) {
      throw new HttpException('Product not found.', HttpStatus.NOT_FOUND);
    }
    await this.repository.remove(product);
    return `Product deleted successfully`;
  }
}
