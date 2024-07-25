import { Type } from "class-transformer";
import { IsNotEmpty,
    IsString,
    IsPhoneNumber, 
    IsDate, 
    IsNumber,
    ArrayMinSize,
    ValidateNested
   } from "class-validator";

export class CartItemDTO{
    productIds: string[];
    quantity: number;

    constructor(data: any){
        this.productIds = data.productIds;
        this.quantity = data.quantity;
    }
}