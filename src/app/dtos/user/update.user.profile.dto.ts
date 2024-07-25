import { IsNotEmpty,
    IsString,
    IsPhoneNumber, 
   } from "class-validator";

export class UpdateUserDTO{
    fullname: String;
    address: String;

    password: String;
    retype_password: String;

    date_of_birth: Date;

    constructor(data: any){
        this.fullname = data.fullname;
        this.password = data.password;
        this.retype_password = data.retype_password;
        this.address = data.address;
        this.date_of_birth = data.date_of_birth;
    }
}