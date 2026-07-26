import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/modules/user/entity/user.entity";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { Repository } from "typeorm";

@Injectable()
export class RolesGuard extends JwtAuthGuard implements CanActivate {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isAuthenticated = await super.canActivate(context);
        if (!isAuthenticated) return false;

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user || !user.id) {
            throw new HttpException({ message: 'Unauthorized' }, HttpStatus.UNAUTHORIZED);
        }

        const dbUser = await this.userRepository.findOne({
            where: { id: user.id },
            select: ['id', 'role'],
        });
        if (!dbUser) {
            throw new HttpException({ message: 'User not found' }, HttpStatus.UNAUTHORIZED);
        }

        if (dbUser.role !== 'admin') {
            throw new HttpException({ message: 'Not authorized to perform this action' }, HttpStatus.FORBIDDEN);
        }

        return true;
    }
}