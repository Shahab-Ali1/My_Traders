import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { PasswordUtil } from 'src/utility/hashing';
import { LoginUserDto } from '../dto/login-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        protected repository: Repository<User>,
    ) { }
    async createUser(createUserDto: CreateUserDto) {
        if (createUserDto.password !== createUserDto.confirm_password) {
            throw new HttpException("Password and confirm password is not matched", HttpStatus.BAD_REQUEST)
        }
        const hashedPassword = await PasswordUtil.hash(createUserDto.password);
        const create = this.repository.create({ ...createUserDto, password: hashedPassword });
        return await this.repository.save(create);
    }

    async loginUser(loginUserDto: LoginUserDto) {
        const getUser = await this.repository.findOne({
            where: {email: loginUserDto.email}
        })
        if(!getUser) {
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        }
        const isPasswordMatched = await PasswordUtil.compare(loginUserDto.password, getUser.password);
        if(!isPasswordMatched) {
            throw new HttpException("Invalid password", HttpStatus.UNAUTHORIZED);
        }
        return getUser;
    }

    async updateUser() {
        return 'Update User';
    }
}
