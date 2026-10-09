import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { PlayersService } from '../players/players.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private playersService: PlayersService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  /** Shape the client expects: { id, email, hunterName, role: 'USER' | 'ADMIN' } */
  private toClientUser(user: any) {
    const obj = typeof user.toObject === 'function' ? user.toObject() : user;
    const roles: string[] = Array.isArray(obj.role) ? obj.role : [obj.role];
    return {
      id: String(obj._id),
      email: obj.email,
      hunterName: obj.username,
      role: roles.includes('admin') ? 'ADMIN' : 'USER',
    };
  }

  async login(user: any) {
    const obj = typeof user.toObject === 'function' ? user.toObject() : user;
    const base = { email: obj.email, sub: String(obj._id), role: obj.role };
    return {
      // `typ` stops a refresh token from being used as an access token
      accessToken: this.jwtService.sign({ ...base, typ: 'access' }, { expiresIn: '15m' }),
      refreshToken: this.jwtService.sign({ ...base, typ: 'refresh' }, { expiresIn: '7d' }),
      user: this.toClientUser(obj),
    };
  }

  /** Swaps a valid refresh token for a fresh pair of tokens. */
  async refresh(refreshToken: string) {
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
    if (payload.typ !== 'refresh') throw new UnauthorizedException('Invalid refresh token');

    // Reload the user so deleted accounts and role changes are respected
    const user = await this.usersService.findById(payload.sub);
    if (!user) throw new UnauthorizedException('User no longer exists');
    return this.login(user);
  }

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 12);
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    // Auto-create the player profile
    await this.playersService.create(user._id.toString());

    return this.login(user);
  }
}
