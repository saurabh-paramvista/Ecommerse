import { CartEntity } from "src/cart/entities/cart.entity";
import { CategoreyEntity } from "src/categoreys/entities/categorey.entity";
import { OrderEntity } from "src/order/entities/order.entity";
import { PaymentEntity } from "src/payment/entities/payment.entity";
import { ProductEntity } from "src/products/entities/product.entity";
import { ReviewEntity } from "src/review/entities/review.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class UserEntity 
{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @Column({unique:true})
    email:string;

    @Column()
    password:string;

    @Column({type:'enum',enum:UserRole,array:true,default:[UserRole.USER]})
    roles:UserRole[];

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

    @OneToMany(()=>CategoreyEntity,(cat)=>cat.addedBy)
    categories:CategoreyEntity[];

    @OneToMany(()=>ProductEntity,(prod)=>prod.addedBy)
    products:ProductEntity[];

    @OneToMany(()=>ReviewEntity,(rev)=>rev.user)
    reviews:ReviewEntity[];

    @OneToMany(()=>OrderEntity,(order)=>order.updatedBy)
    ordersUpdateBy:OrderEntity[];

    @OneToMany(()=>OrderEntity,(order)=>order.user)
    orders:OrderEntity[];

    @OneToMany(()=>CartEntity,(cart)=>cart.addedBy)
    addProduct:CartEntity[];
    
    @OneToMany(()=>PaymentEntity,(payment)=>payment.user)
    payments:PaymentEntity[];
}
