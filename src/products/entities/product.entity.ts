import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({name: 'products'})
export class Product {
  @ApiProperty({
    example: '407f92c6-fc1a-4bf0-a076-4abe3d8a825e',
    description: 'Product ID',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'T-shirt Teslo',
    description: 'Product Title',
    uniqueItems: true
  })
  @Column({
    type: 'text',
    unique: true
  })
  title: string;

  @ApiProperty({
    example: 0,
    description: 'Product Price',
    default: 0
  })
  @Column({
    type: 'float',
    default: 0
  })
  price: number;

  @ApiProperty({
    example: 'Anim reprehenderit null a in anim mollit minim irure commodo',
    description: 'Product Description'
  })
  @Column({
    type: 'text',
    nullable: true
  })
  description: string;

  @ApiProperty({
    example: 't_shirt_teslo',
    description: 'Product Slug - for SEO routes',
    uniqueItems: true
  })
  @Column({
    type: 'text',
    unique: true
  })
  slug: string;

  @ApiProperty({
    example: 10,
    description: 'Product Stock',
    default: 0
  })
  @Column({
    type: 'int',
    default: 0
  })
  stock: number;

  @ApiProperty({
    example: ['M', 'XL', 'XXL'],
    description: 'Product Sizes'
  })
  @Column({
    type: 'text',
    array: true
  })
  sizes: string[];

  @ApiProperty({
    example: 'women',
    description: 'Product Gender',
    uniqueItems: true
  })
  @Column({
    type: 'text'
  })
  gender: string;

  @ApiProperty({
    example: ['jacket'],
    description: 'Product Tagsd'
  })
  @Column({
    type: 'text',
    array: true,
    default: []
  })
  tags: string[];
  // images
  @ApiProperty({
    example: ['1740250-00-A_0_2000.jpg', '1740250-00-A_1.jpg'],
    description: 'Product Tagsd'
  })
  @OneToMany(
    () => ProductImage,
    productImage => productImage.product,
    {cascade: true, eager: true}
  )
  images?: ProductImage[];

  @ManyToOne(
    () => User,
    user => user.product,
    {eager: true}
  )
  user: User

  @BeforeInsert()
  checkSlugInsert() {
    if(!this.slug) this.slug = this.title
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '')
  }

  @BeforeUpdate() 
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '')
  }
} 
