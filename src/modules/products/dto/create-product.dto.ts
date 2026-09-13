import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    @ApiProperty({
        type: 'number',
        example: 1
    })
    @IsNotEmpty()
    @Transform(({ value }) => Number(value))
    @Type(() => Number)
    @IsNumber()
    category_id: number;

    @ApiProperty({
        type: 'string',
        example: 'coke'
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({
        type: 'string',
        example: 'Soft drinks'
    })
    @IsString()
    description?: string;

    @ApiProperty({
        type: 'number',
        example: 100
    })
    @IsNotEmpty()
    purchase_price: number;

    @ApiProperty({
        type: 'number',
        example: 150
    })
    @IsNotEmpty()
    sale_price: number;

    @ApiProperty({
        type: 'string',
        example: '10'
    })
    @IsNotEmpty()
    stock: string;

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


    @IsOptional()
    @ApiPropertyOptional({ type: "string", format: "binary" })
    media?: string
}
