import { ClassSerializerInterceptor, Controller, Get, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller("user")
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('token')
    @Get()
    getUsers(
        @CurrentUser() user
    ) {
        console.log("user", user)
        return 'Get all Users';
    }

    @Patch("update")
    async updateUser() {
        return this.userService.updateUser();
    }
}
