import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { compare } from 'bcrypt';
import { Repository } from 'typeorm';
import { LoginDto } from './Dto/login.dto';
import { RegistrationDto } from './Dto/registration.dto';
import { TokenResponse } from './Dto/tokens.dto';
import { RegistrationResDto } from './Dto/user.res.dto';
import { RefreshTokenEntity } from './Entities/refresh.token.entity';
import { UserEntity } from './Entities/user.entity';
import { TokenInputData } from './Interfaces/token.input.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private user: Repository<UserEntity>,
    @InjectRepository(RefreshTokenEntity)
    private refreshTokenEntity: Repository<RefreshTokenEntity>,
    private jwtService: JwtService,
  ) {}

  async registration(registerdata: RegistrationDto): Promise<TokenResponse> {
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

    const tokens = this.getTokens(user);
    return tokens;
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

  // async addRefreshToken(user: ): Promise<RefreshTokenEntity> {
  //   this.refreshTokenEntity.insert({
  //     token:
  //   })
  // }

  public async getTokens(userData: TokenInputData): Promise<TokenResponse> {
    const [accessTok, refreshTok] = await Promise.all([
      this.jwtService.sign(
        {
          id: userData.id,
          email: userData.email,
          firstname: userData.firstname,
        },
        {
          secret: process.env.ACCESS_KEY,
          expiresIn: process.env.ACCESS_EXPIRE,
        },
      ),
      this.jwtService.sign(
        {
          id: userData.id,
          email: userData.email,
          firstname: userData.firstname,
        },
        {
          secret: process.env.REFRESH_KEY,
          expiresIn: process.env.REFRESH_EXPIRE,
        },
      ),
    ]);
    return {
      access_Token: accessTok,
      refresh_Token: refreshTok,
    };
  }
}
