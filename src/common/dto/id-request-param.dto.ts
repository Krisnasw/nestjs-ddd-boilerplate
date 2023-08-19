import { ApiProperty } from '@nestjs/swagger/dist';
import { IsString } from 'class-validator';

export class IdRequestParamDto {
  @IsString()
  @ApiProperty()
  readonly id!: string;
}
