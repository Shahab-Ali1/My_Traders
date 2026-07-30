import { Body, ClassSerializerInterceptor, Controller, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { RolesGuard } from 'src/common/guards/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from '../dto/create-user.dto';
import { storage } from 'src/utility/file.util';

@Controller("user")
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    // @UseGuards(JwtAuthGuard)
    @UseGuards(RolesGuard)
    @ApiBearerAuth('token')
    @Get()
    getUsers(
        @CurrentUser() user
    ) {
        return 'Get all Users';
    }

    @Patch("update")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('token')
    @UseInterceptors(FileInterceptor('media', storage()))
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UpdateUserDto })
    async updateUser(
        @CurrentUser() user,
        @Body() updateUserDto: UpdateUserDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.userService.updateUser(updateUserDto, file, user);
    }
}
