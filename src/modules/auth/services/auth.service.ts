import { UserService } from '@/modules/users/services/user.service';
import { Injectable } from '@nestjs/common';
import { AuthRegisterDto } from '../dtos/create.dto';
import { AuthLoginDto } from '../dtos/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SettingService } from '@/shared/services/setting.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly settingService: SettingService,
  ) {}

  async register(data: AuthRegisterDto) {
    const checkEmailExists = await this.userService.findUserByEmail(data.email);
    if (checkEmailExists) {
      throw new Error('Email already exists');
    }

    return await this.userService.create(data);
  }

  async login(data: AuthLoginDto) {
    const user = await this.userService.findUserByEmail(data.email);
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Credentials not match');
    }

    delete user.password;

    const accessToken = await this.jwtService.sign(user);

    return { user, accessToken };
  }
}
