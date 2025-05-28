import { OrderEntity } from "src/order/entities/order.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";


export enum PaymentStatus
{
    PENDDING='pendding',
    COMPLETED='completed',
    FAILED='feiled'
}

@Entity('payment')
export class PaymentEntity 
{
   @PrimaryGeneratedColumn()
   id:number;

   @Column('decimal',{precision:10,scale:2})
   amount:number;

   @Column({type:'enum',enum:PaymentStatus,array:true,default:[PaymentStatus.PENDDING]})
   status:PaymentStatus[];

   @Column()
   method:string;

   @Column({nullable:true})
   transactionId:string;

   @CreateDateColumn()
   createdAt:Date;

   @ManyToOne(()=>UserEntity,(user)=>user.payments)
   user:UserEntity;

   @OneToOne(()=>OrderEntity,(order)=>order.payment)
   @JoinColumn()
   order:OrderEntity;
}
