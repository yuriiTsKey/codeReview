import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegistrationDto } from './Dto/registration.dto';
import { UserEntity } from './Entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './Dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private user: Repository<UserEntity>,
  ) {}

  async registration(registerdata: RegistrationDto): Promise<UserEntity> {
    if (!registerdata) {
      throw new HttpException(
        'inputed data cannot be empty',
        HttpStatus.FAILED_DEPENDENCY,
      );
    }

    let user = this.user.create(registerdata);
    await this.user.insert(user);
    return user;
  }

  async login(login: LoginDto): Promise<UserEntity> {
    let user = this.user.findOne({ email: login.email });
    if (!user) {
      throw new HttpException(
        'This user not registered yet',
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  public hashPassword(password: string) {
    return bcrypt.hashSync(password, 10);
  }
}
