import { User } from "./User";

export interface AuthenticatedUser extends User{
    id:number,
    img_path:string;
}