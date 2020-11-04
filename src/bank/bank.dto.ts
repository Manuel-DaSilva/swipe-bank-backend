import { IsString, MinLength, MaxLength } from "class-validator";

export class bankDto {

    readonly id?: string;
    readonly apiKey?: string;

    @IsString()
    @MinLength(6)
    @MaxLength(30)
    name: string;

    @IsString()
    @MinLength(6)
    @MaxLength(30)
    apiEndpoint: string;
    
    @IsString()
    @MinLength(6)
    @MaxLength(10)
    code: string;
 
}