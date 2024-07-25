import { IsNotEmpty,
         IsString,
         IsPhoneNumber, 
         IsDate 
        } from "class-validator";

export class RegisterDTO{
    @IsString()
    fullname: String;

    @IsPhoneNumber()
    phone_number: String;

    @IsString()
    @IsNotEmpty()
    address: String;

    @IsString()
    @IsNotEmpty()
    password: String;

    @IsString()
    @IsNotEmpty()
    retype_password: String;

    
    // is_accepted: boolean;
    @IsDate()
    date_of_birth: Date;
    facebook_account_id: number = 0 ;
    google_account_id: number = 0;
    role_id: number = 1;


    constructor(data: any){
        this.fullname = data.fullname;
        this.phone_number = data.phone_number;
        this.password = data.password;
        this.retype_password = data.retype_password;
        this.address = data.address;
        // this.is_accepted = data.is_accepted;
        this.date_of_birth = data.date_of_birth;
        this.facebook_account_id = data.facebook_account_id || 0;
        this.google_account_id = data.google_account_id || 0;
        this.role_id = data.role_id || 1;
    }
}