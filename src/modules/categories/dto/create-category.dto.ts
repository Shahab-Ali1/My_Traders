import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

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


    @IsOptional()
    @ApiPropertyOptional({ type: "string", format: "binary" })
    media?: string
}
