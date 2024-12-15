import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    private readonly productService: ProductsService
  ){}

  async runSeed() {
    return this.insertNewProducts();
  }

  private async insertNewProducts(): Promise<boolean> {
    await this.productService.deleteAllProducts();
    const insertPromises = [];
    initialData.products.forEach(product => insertPromises.push(this.productService.create(product)));
    await Promise.all(insertPromises);
    return true;
  }
}
