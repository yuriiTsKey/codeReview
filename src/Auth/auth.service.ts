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
import { compare } from 'bcrypt';
import { LoginDto } from './Dto/login.dto';
import { RegistrationResDto } from './Dto/user.res.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private user: Repository<UserEntity>,
  ) {}

  async registration(
    registerdata: RegistrationDto,
  ): Promise<RegistrationResDto> {
    if (!registerdata) {
      throw new HttpException(
        'inputed data cannot be empty',
        HttpStatus.FAILED_DEPENDENCY,
      );
    }

    registerdata.password = this.hashPassword(registerdata.password);

    let user = this.user.create(registerdata);
    await this.user.insert(user);
    delete user.password;
    return user;
  }

  async login(loginDto: LoginDto): Promise<RegistrationResDto> {
    let currentUser = await this.user.findOne(
      { email: loginDto.email },
      { select: ['email', 'firstname', 'id', 'password'] },
    );
    if (!currentUser) {
      throw new HttpException(
        'This user not registered yet',
        HttpStatus.NOT_FOUND,
      );
    }

    const isPasswordCorrect = compare(loginDto.password, currentUser.password);
    if (!isPasswordCorrect) {
      throw new HttpException(
        'Password is not compared',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    delete currentUser.password;

    return currentUser;
  }

  public hashPassword(password: string) {
    return bcrypt.hashSync(password, 10);
  }
}
