import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {

  constructor(
    private readonly productService: ProductsService,
    @InjectRepository(User)
    private readonly userRepostory: Repository<User>
  ){}

  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.insertUsers();
    await this.insertNewProducts(adminUser);
    return 'SEED EXECUTED';
  }

  private async deleteTables () {
    await this.productService.deleteAllProducts();
    const queryBuilder = this.userRepostory.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;
    const users: User[] = [];
    seedUsers.forEach( user => {
      users.push( this.userRepostory.create(user))
    });
    const dbUsers = await this.userRepostory.save(seedUsers);

    return dbUsers[0];

  }

  private async insertNewProducts(user: User): Promise<boolean> {
    await this.productService.deleteAllProducts();
    const insertPromises = [];
    initialData.products.forEach(product => insertPromises.push(this.productService.create(product, user)));
    await Promise.all(insertPromises);
    return true;
  }
}
