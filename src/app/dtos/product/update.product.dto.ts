import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateProductDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    thumbnail: string;

    @IsNumber()
    @IsNotEmpty()
    category_id: number;

    constructor(data: any) {
        this.name = data.name;
        this.price = data.price;
        this.description = data.description;
        this.thumbnail = data.thumbnail;
        this.category_id = data.category_id;
    }
}
