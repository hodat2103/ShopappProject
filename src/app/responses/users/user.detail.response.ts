import { Role } from "../../models/role";

export interface UserResponse{
    id: number;
    fullname: string;
    phone_number: string;
    email: string;
    address: string;
    active: boolean;
    date_of_birth: Date;
    facebook_account_id: number;
    google_account_id: number;
    is_active: number;
    role: Role;
}