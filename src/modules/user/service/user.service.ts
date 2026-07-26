import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        protected repository: Repository<User>,
    ) { }
    async createUser(createUserDto: CreateUserDto) {
        const create = this.repository.create(createUserDto);
        return await this.repository.save(create);
    }

    async updateUser() {
        return 'Update User';
    }
}
