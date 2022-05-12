import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { userFromJwt } from '../Interfaces/jwt.user.interface';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../Entities/user.entity';
import { Repository } from 'typeorm';
import { isJwtExpired } from 'jwt-check-expiration';

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
      throw new Error('This token has expired');
    }
    if (!validAcessToken) {
      throw new Error('No acess token');
    }

    const imputJwtUser = <userFromJwt>(
      jwt.verify(validAcessToken, process.env.ACCESS_KEY)
    );

    const currentUser = await this.user.findOne({
      email: imputJwtUser.email,
    });
    if (imputJwtUser.email != currentUser.email) {
      console.log('jwt user not the same');
      return false;
    }
    return true;
  }
}
