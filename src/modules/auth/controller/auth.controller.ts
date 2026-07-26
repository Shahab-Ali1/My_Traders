import { Body, ClassSerializerInterceptor, Controller, Get, Patch, Post, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { LoginUserDto } from 'src/modules/user/dto/login-user.dto';
import { UserService } from 'src/modules/user/service/user.service';
import { AuthService } from '../service/auth.service';

@Controller("auth")
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly service: AuthService,
    ) { }
    @Post("signup")
    @ApiBody({ type: CreateUserDto })
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    @Post("login")
    @ApiProperty({ type: LoginUserDto })
    async loginUser(
        @Body() loginUserDto: LoginUserDto
    ) {
        const user = await this.userService.loginUser(loginUserDto);
        const payload = { id: user.id, username: user.email };
        const token = await this.service.generateToken(payload);
        return { ...user, access_token: token };
    }

}
