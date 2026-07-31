import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty({
        type: 'string',
        example: 'Beverages'
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
