import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { isJwtExpired } from 'jwt-check-expiration';
import { Repository } from 'typeorm';
import { UserEntity } from '../Entities/user.entity';
import { userFromJwt } from '../Interfaces/jwt.user.interface';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(
    @InjectRepository(UserEntity) private user: Repository<UserEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const validAcessToken = ctx
      .getContext()
      .req.headers.authorization.toString();

    if (isJwtExpired(validAcessToken) == true) {
      throw new Error('Access token has expired');
    }
    if (!validAcessToken) {
      throw new Error('Access token is empty');
    }

    const imputJwtUser = <userFromJwt>(
      jwt.verify(validAcessToken, process.env.ACCESS_KEY)
    );

    const currentUser = await this.user.findOne({
      email: imputJwtUser.email,
    });
    if (imputJwtUser.email != currentUser.email) {
      console.log('jwt user not the same as in token');
      return false;
    }
    return true;
  }
}
