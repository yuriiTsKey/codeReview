import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { compare } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { getConnection, getManager, Repository } from 'typeorm';
import { LoginDto } from './Dto/login.dto';
import { RefreshInputDto } from './Dto/refresh.token.dto';
import { RegistrationDto } from './Dto/registration.dto';
import { TokenResponse } from './Dto/tokens.dto';
import { RefreshTokenEntity } from './Entities/refresh.token.entity';
import { UserEntity } from './Entities/user.entity';
import { userFromJwt } from './Interfaces/jwt.user.interface';
import { TokenUserData } from './Interfaces/token.data.interface';

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

    if (await this.user.findOne({ email: registerdata.email })) {
      throw new HttpException(
        'Email has already registered',
        HttpStatus.ACCEPTED,
      );
    }
    registerdata.password = this.hashPassword(registerdata.password);

    let user = this.user.create(registerdata);
    await this.user.insert(user);
    delete user.password;

    const tokens = this.getTokens(user);
    await this.addRefreshToken(user.id, (await tokens).refresh_Token);
    return tokens;
  }

  async login(loginDto: LoginDto): Promise<TokenResponse> {
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

    if (!compare(loginDto.password, currentUser.password)) {
      throw new HttpException(
        'Password is not compared',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    delete currentUser.password;
    const tokens = this.getTokens(currentUser);
    await this.addRefreshToken(currentUser.id, (await tokens).refresh_Token);

    return tokens;
  }

  async chageRefreshToken(refreshInputDto: RefreshInputDto): Promise<any> {
    console.log('123');
    const curUser = await this.user.findOne({ email: refreshInputDto.email });
    if (!curUser) throw new Error('User not registered');

    const refreshToken = await this.getRefreshToken(
      curUser.id,
      refreshInputDto.refresh_token,
    );

    if (refreshInputDto.refresh_token != refreshToken) {
      throw new Error('refresh token not compared');
    }

    const newTokens = await this.getTokens(curUser);

    await this.updateRefreshToken(
      curUser.id,
      refreshInputDto.refresh_token,
      newTokens.refresh_Token,
    );

    return newTokens;
  }

  public hashPassword(password: string) {
    return bcrypt.hashSync(password, 10);
  }

  async addRefreshToken(userId: number, tokenRefresh: string) {
    const imputJwtUser = <userFromJwt>(
      jwt.verify(tokenRefresh, process.env.REFRESH_KEY)
    );
    await this.refreshTokenEntity.insert({
      refreshtoken: tokenRefresh,
      expired: imputJwtUser.exp,
      user: { id: userId },
    });
  }

  async deleteExpireToken() {
    const currentTime = Math.floor(Date.now() / 1000);
    await this.refreshTokenEntity
      .createQueryBuilder('token')
      .delete()
      .from(RefreshTokenEntity)
      .where(`expired <= :currentDate`, { currentDate: currentTime })
      .execute();
    return 1;
  }

  async getRefreshToken(idUser: number, tokenRefresh: string): Promise<string> {
    const refresh = await getManager()
      .getRepository(RefreshTokenEntity)
      .createQueryBuilder('token')
      .select('token.refreshtoken')
      .where('token.token_id_user = :id AND token.refreshtoken = :refreshTok', {
        id: idUser,
        refreshTok: tokenRefresh,
      })
      .getOne();
    return refresh.refreshtoken;
  }

  async updateRefreshToken(
    idUser: number,
    oldToken: string,
    newToken: string,
  ): Promise<any> {
    return await getConnection()
      .createQueryBuilder()
      .update(RefreshTokenEntity)
      .set({ refreshtoken: newToken })
      .where('token_id_user = :id AND token.refreshtoken = :oldToken', {
        id: idUser,
        oldToken: oldToken,
      })
      .execute();
  }

  async markEmailAsConfirmae(email: string) {
    return this.user.update(
      { email },
      {
        isEmailConfirmed: true,
      },
    );
  }

  async getUserByMail(userMail: string): Promise<UserEntity> {
    return await this.user.findOne({ email: userMail });
  }

  public async getTokens(userData: TokenUserData): Promise<TokenResponse> {
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
