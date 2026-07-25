import { Body, ClassSerializerInterceptor, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller("user")
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }
    @Get()
    getUsers() {
        return 'Get all Users';
    }

    @Post("create")
    @ApiBody({ type: CreateUserDto })
    async createUser(
       @Body() createUserDto: CreateUserDto
    ) {
        return this.userService.createUser(createUserDto);
    }
}
