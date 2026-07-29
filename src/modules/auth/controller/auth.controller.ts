import { Body, ClassSerializerInterceptor, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { LoginUserDto } from 'src/modules/user/dto/login-user.dto';
import { UserService } from 'src/modules/user/service/user.service';
import { AuthService } from '../service/auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/utility/file.util';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/modules/user/entity/user.entity';

@Controller("auth")
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly service: AuthService,
    ) { }

    @Post("login")
    @ApiProperty({ type: LoginUserDto })
    async loginUser(
        @Body() loginUserDto: LoginUserDto
    ) {
        const user:any = await this.userService.loginUser(loginUserDto);
        const payload = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
            gender: user.gender,
            last_login_at: user.last_login_at
        };
        const token = await this.service.generateToken(payload);
        user.access_token = token;
        // return { ...user, access_token: token };
        // return {  ...plainToInstance(User, user), access_token: token };
        return user;
    }

    @Post("signup")
    @UseInterceptors(FileInterceptor('media', storage()))
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: CreateUserDto })
    createUser(
        @Body() createUserDto: CreateUserDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.userService.createUser(createUserDto, file);
    }


}
