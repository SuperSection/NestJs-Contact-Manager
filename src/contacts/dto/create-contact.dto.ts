import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

export class CreateContactDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: number;

  @IsOptional()
  @IsString()
  postalAddress: string;
}
