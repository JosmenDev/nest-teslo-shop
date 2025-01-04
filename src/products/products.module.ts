import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage]),
    AuthModule
  ],
  exports: [
    ProductsService
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
