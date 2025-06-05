import { CartEntity } from "src/cart/entities/cart.entity";
import { CategoreyEntity } from "src/categoreys/entities/categorey.entity";
import { OrdersProductsEntity } from "src/order/entities/orders-products.entity";
import { ReviewEntity } from "src/review/entities/review.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity({name:'products'})
export class ProductEntity
{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    title:string;
  
    @Column()
    description:string;

    @Column({type:'decimal',precision:10,scale:2,default:0})
    price:number;

    @Column()
    stock:number;

    @Column('simple-array')
    images:string[];

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

    @ManyToOne(()=>UserEntity,(user)=>user.products)
    addedBy:UserEntity;

    @ManyToOne(()=>CategoreyEntity,(cat)=>cat.products)
    category:CategoreyEntity;

    @OneToMany(()=>ReviewEntity,(rev)=>rev.product)
    reviews:ReviewEntity[];

    @OneToMany(()=>OrdersProductsEntity,(op)=>op.product)
    products:OrdersProductsEntity[];

    @OneToMany(()=>CartEntity,(cart)=>cart.products)
    product:CartEntity[];
}
