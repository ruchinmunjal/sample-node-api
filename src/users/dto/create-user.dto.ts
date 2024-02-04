import { IsEmail, IsEnum,IsString,IsNotEmpty } from "class-validator";

export class CreateUserDto{
    @IsString()
    @IsNotEmpty()
    name:string;
    
    @IsEmail()
    email:string;

    @IsEnum(["INTERN", "ADMIN","ENGINEER"])
    role: 'INTERN'| 'ADMIN'|'ENGINEER'
}