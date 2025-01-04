import { BcryptAdapter } from "src/common/adapters/bcrypt.adapter";
import { Product } from "src/products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    unique: true
  })
  email: string;

  @Column({
    type: 'text',
    select: false
  })
  password: string;

  @Column({
    type: 'text'
  })
  fullName: string;

  @Column({
    type: 'bool',
    default: true
  })
  isActive: boolean;

  @Column({
    type: 'text',
    array: true,
    default: ['user']
  })
  roles: string[];

  @OneToMany(
    () => Product,
    product => product.user,

  )
  product: Product;


  @BeforeInsert()
  async hashPassword() {
    const bcrypt = new BcryptAdapter();
    this.password = await bcrypt.hash(this.password, +process.env.HASH_SALT);
  }

  @BeforeInsert()
  @BeforeUpdate()
  normalizeEmail() {
    this.email = this.email.toLocaleLowerCase().trim();
  }
  
}
