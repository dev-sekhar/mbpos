//Define and validate tenant registration input.
import { IsString, IsEmail, MinLength } from 'class-validator';

export class RegisterTenantDto {
  @IsString()
  name: string;

  @IsString()
  subdomain: string;

  @IsString()
  adminName: string;

  @IsEmail()
  adminEmail: string;

  @IsString()
  @MinLength(6)
  adminPassword: string;
}

