import { Expose, Transform, Type } from "class-transformer";


export class ProductsDto
{
    totalProduct:number;

    limit:number;

    @Type(()=>ProductList)
    products:ProductList[];
}

export class ProductList
{
    id:number;

    title:string;

    description:string;

    price:number;

    stock:number;

    @Transform(({value})=>value.toString().split(','))
    images:string[];


    @Transform(({obj})=>{
    return{
      id:obj.category_id,
      title:obj.category_title
    }})
    category:any;

    
}