import { UserEntity } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { ShippingEntity } from "./shipping.entity";
import { OrdersProductsEntity } from "./orders-products.entity";
import { PaymentEntity } from "src/payment/entities/payment.entity";

export enum OrderStatus
{
    PROCESSING="processing",
    SHIPPED="shipped",
    DELEVERED="delevered",
    CANCELLED="cancelled",
    PENDING = "PENDING"
}

@Entity({name:'orders'})
export class OrderEntity 
{
    @PrimaryGeneratedColumn()
    id:number;

    @CreateDateColumn()
    orderAt:Date;

    @Column({type:"enum",enum:OrderStatus,default:OrderStatus.PROCESSING})
    status:string;


    @Column({nullable:true})
    shippedAt:Date;

    @Column({nullable:true})
    deliverdAt:Date;


    @ManyToOne(()=>UserEntity,(user)=>user.ordersUpdateBy)
    updatedBy:UserEntity;

    @OneToOne(()=>ShippingEntity,(ship)=>ship.order,{cascade:true})
    @JoinColumn()
    shippingAddress:ShippingEntity;

    @OneToMany(()=>OrdersProductsEntity,(op)=>op.order,{cascade:true})
    products:OrdersProductsEntity[];

    @ManyToOne(()=>UserEntity,(user)=>user.orders)
    user:UserEntity;

    @OneToOne(()=>PaymentEntity,(payment)=>payment.order)
    payment:PaymentEntity;
}
