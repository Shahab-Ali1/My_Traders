import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginUserDto{
    @ApiProperty({type: String, example: "admin@example.com"})
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({type: String, example: "password123"})
    @IsNotEmpty()
    @IsString()
    password: string;
}