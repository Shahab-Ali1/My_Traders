import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Gender } from "../constants/user-role.enum";

export class CreateUserDto {
     /**
    * The first name of the user.
    * @example "John"
    */
   @ApiProperty({
        type: 'string',
        example: 'John'
    })
    @IsString()
    @IsNotEmpty()
    first_name: string;

     /**
    * The last name of the user.
    * @example "Doe"
    */
   @ApiProperty({
        type: 'string',
        example: 'Doe'
    })
    @IsString()
    @IsNotEmpty()
    last_name: string;

     /**
    * The email of the user.
    * @example "john.doe@example.com"
    */
   @ApiProperty({
        type: 'string',
        example: 'john.doe@example.com'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

     /**
    * The password of the user.
    * @example "password123"
    */
    @ApiProperty({
        type: 'string',
        example: 'password123'
    })
    @IsString()
    @IsNotEmpty()
    password: string;

    /**
    * The gender of the user.
    * @example "male"
    */
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        type: 'string',
        enum: Object.values(Gender),
        example: 'male'
    })
    @IsEnum(Gender)
    gender: Gender
}