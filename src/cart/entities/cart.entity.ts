import { ProductEntity } from "src/products/entities/product.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('carts')
export class CartEntity
{
  @PrimaryGeneratedColumn()
  id:number;

  @Column()
  quantity:number;

  @ManyToOne(()=>UserEntity,(user)=>user.addProduct)
  addedBy:UserEntity;

  @ManyToOne(()=>ProductEntity,(prod)=>prod.product)
  products:ProductEntity;
}
