// import { Type } from "class-transformer";
// import { IsNotEmpty,
//     IsString,
//     IsPhoneNumber, 
//     IsDate, 
//     IsNumber,
//     ArrayMinSize,
//     ValidateNested
//    } from "class-validator";
import { Product } from "../models/product";

export class OrderDetailDTO{
    order_id: number;
    product: Product;
    price: number;
    numberOfProduct: number;
    total_money: number;
    color: string;
    
    constructor(data: any){
        this.order_id = data.order_id;
        this.product = data.product;
        this.price = data.price;
        this.numberOfProduct = data.number_of_product;
        this.total_money = data.total_money;
        this.color = data.color;

    }
}