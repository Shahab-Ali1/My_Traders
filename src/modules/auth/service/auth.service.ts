import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
    ) { }
    async generateToken(payload: any) {
        return await this.jwtService.signAsync(payload, {expiresIn: '1d'});
    }

}
