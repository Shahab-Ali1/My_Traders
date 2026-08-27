import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateStoreDto {
    @ApiProperty({
        type: 'string',
        example: 'my store'
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        type: 'string',
        example: '123 Main St'
    })
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({
        type: 'string',
        example: '123-456-7890'
    })
    @IsString()
    @IsNotEmpty()
    phone: string;  

    @ApiProperty({
        type: 'boolean',
        example: true,
        description: 'status is active or non-active',
        default: true,
    })
    @IsNotEmpty()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    status: boolean;


}
