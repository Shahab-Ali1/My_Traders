import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { UserRoles } from 'src/modules/user/constants/user-role.enum';

// Custom JWT extractor that checks both header and cookie
const jwtExtractor = (req: Request): string | null => {
  let token:any = null;

  // First, try to extract from Authorization header
  if (req && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }

  // If not found in header, try cookie
  if (!token && req && req.cookies) {
    token = req.cookies['auth_token'];
  }

  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: jwtExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true, // necessary to access req
    });
  }

  async validate(req: Request, payload: any) {
    const token = jwtExtractor(req);
    if (!token) {
      throw new UnauthorizedException({ message: "Unauthorized" });
    }
    // Verify the token
    await this.verifyTokenOrThrow(token);
    return {
      id: payload.id,
      first_name: payload.first_name,
      last_name: payload.last_name,
      email: payload.email,
      is_admin: payload.role === UserRoles.ADMIN,
      last_login_at: payload.last_login_at,
      gender: payload.gender
    };
  }

  async verifyTokenOrThrow(token: string) {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (err) {
      throw new UnauthorizedException({ message: "Unauthorized" });
    }
  }
}