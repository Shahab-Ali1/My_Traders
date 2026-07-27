import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginUserDto{
    @ApiProperty({type: String, example: "ali@mail.com"})
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({type: String, example: "Ali12345"})
    @IsNotEmpty()
    @IsString()
    password: string;
}