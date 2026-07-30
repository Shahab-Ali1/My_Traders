import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { PasswordUtil } from 'src/utility/hashing';
import { LoginUserDto } from '../dto/login-user.dto';
import { MediaService } from './media.service';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        protected repository: Repository<User>,
        protected mediaService: MediaService,
    ) { }

    async findOneById(id: number, relation: string[] = []) {
        const user = await this.repository.findOne({
            where: { id: id },
            relations: relation
        });
        if (!user) {
            throw new HttpException("User not found.", HttpStatus.BAD_REQUEST);
        }

        return user;
    }

    async loginUser(loginUserDto: LoginUserDto) {
        const getUser = await this.repository.findOne({
            where: { email: loginUserDto.email },
            relations: ["profileImage"]
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

    async createUser(createUserDto: CreateUserDto, file) {
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
        const create = this.repository.create({ ...createUserDto, last_login_at: new Date().toISOString(), password: hashedPassword });
        // return await this.repository.save(create);

        if (file) {
            const module = "user/profile"
            const media: any = await this.mediaService.uploadMedia(file, module, file.originalname, "profile");
            create.profileImage = media.id;
        }
        return await this.repository.save(create);

    }

    async updateUser(updateUserDto: UpdateUserDto, file: Express.Multer.File, user: User) {
        const findUser: any = await this.findOneById(user.id, ['profileImage']);
        // 
        if (file) {
            // remove old media
            if (findUser.profileImage) {
                // const oldImagePath = path.join(
                //     process.cwd(),
                //     'public',
                //     findUser.profileImage.key,
                //     findUser.profileImage.name,
                // );
                // if (fs.existsSync(oldImagePath)) {
                //     fs.unlinkSync(oldImagePath);
                // }
                await this.mediaService.deleteMedia(findUser.profileImage.id, findUser.profileImage.key, findUser.profileImage.name);
            }
            // upload new media
            const module = "user/profile"
            const media: any = await this.mediaService.uploadMedia(file, module, file.originalname, "profile");
            findUser.profileImage = media.id;
        }
        await this.repository.update(findUser.id, {...findUser, ...updateUserDto });
        return "user updated successfully.";
    }
}
