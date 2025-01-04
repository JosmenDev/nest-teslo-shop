import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { validate as isUUID } from 'uuid';
import { ProductImage } from './entities/product-image.entity';
import { ProductResponse } from './interfaces/product-response.interface';
import { transformProduct } from './helpers/transform-product.helper';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource
  ) {}

  async create(createProductDto: CreateProductDto, user: User): Promise<ProductResponse> {
    const { images = [], ...productDetails } = createProductDto;
    const product = this.productRepository.create({
      ...productDetails,
      images: images.map(image=>this.productImageRepository.create({url: image})),
      user
    });
    await this.productRepository.save(product);
    return transformProduct(product);
  }

  async findAll(paginationDto: PaginationDto): Promise<ProductResponse[]> {
    const { limit = 10, offset = 0 } = paginationDto;
    const products =  await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true
      }
    });
    return products.map(transformProduct);
  }

  async findOne(term: string): Promise<Product|null> {
    let product: Product;
    if( isUUID(term)) {
      product = await this.productRepository.findOneBy({id: term});
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('product');
      product = await queryBuilder
        .where('product.title ILIKE :title or product.slug ILIKE :slug', {
          title: term,
          slug: term
        })
        .leftJoinAndSelect('product.images', 'productImages')
        .getOne();
    }
    if(!product) throw new NotFoundException(`Product with term ${term} not found`);
    return product;
  }

  async findOnePlain(term: string): Promise<ProductResponse|null> {
    const product = await this.findOne(term);
    return transformProduct(product);
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User): Promise<ProductResponse> {
    const {images, ...productDetails} = updateProductDto;

    const product = await this.productRepository.preload({id, ...productDetails});
    if(!product) throw new NotFoundException(`Product with id ${id} not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, {product: {id}});
        product.images = images.map( image => this.productImageRepository.create({url: image}));
      }
      product.user = user;
      await queryRunner.manager.save(product);

      await queryRunner.commitTransaction();
      return this.findOnePlain(id);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<any> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  async deleteAllProducts () {
    const queryBuilder = this.productRepository.createQueryBuilder('product');
    return await queryBuilder
      .delete()
      .where({})
      .execute();
  }
}
