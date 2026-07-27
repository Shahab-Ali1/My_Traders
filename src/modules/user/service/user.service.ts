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

    async findOneById(id: number) {
        const user = await this.repository.findOne({
            where: { id: id }
        });
        if (!user) {
            throw new HttpException("User not found.", HttpStatus.BAD_REQUEST);
        }

        return user;
    }

    async loginUser(loginUserDto: LoginUserDto) {
        const getUser = await this.repository.findOne({
            where: { email: loginUserDto.email }
        })
        if (!getUser) {
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        }
        const isPasswordMatched = await PasswordUtil.compare(loginUserDto.password, getUser.password);
        if (!isPasswordMatched) {
            throw new HttpException("Invalid password", HttpStatus.UNAUTHORIZED);
        }
        await this.repository.update(getUser.id, {
            last_login_at: new Date().toISOString()
        });

        getUser.last_login_at = new Date().toISOString();
        return getUser;
    }

    async createUser(createUserDto: CreateUserDto) {
        // validate if email already exist throw error
        const user = await this.repository.findOne({
            where: { email: createUserDto.email }
        });
        if (user) {
            throw new HttpException("This email is already exist", HttpStatus.BAD_REQUEST)
        }

        if (createUserDto.password !== createUserDto.confirm_password) {
            throw new HttpException("Password and confirm password is not matched", HttpStatus.BAD_REQUEST)
        }
        const hashedPassword = await PasswordUtil.hash(createUserDto.password);
        const create = this.repository.create({ ...createUserDto, last_login_at: new Date().toISOString() ,password: hashedPassword });
        return await this.repository.save(create);
    }

    async updateUser() {
        return 'Update User';
    }
}
