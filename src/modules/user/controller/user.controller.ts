import { Body, ClassSerializerInterceptor, Controller, Get, Patch, Post, UseInterceptors } from '@nestjs/common';
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

    @Patch("update")
    async updateUser() {
        return this.userService.updateUser();
    }
}
