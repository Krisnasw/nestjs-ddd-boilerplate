import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTodoDTO {
  @ApiProperty({ type: 'integer' })
  @IsOptional()
  @IsInt()
  category_id?: number;

  @IsOptional()
  @IsInt()
  user_id?: number;

  @ApiProperty({ type: 'string' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ type: 'string' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: 'boolean' })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
