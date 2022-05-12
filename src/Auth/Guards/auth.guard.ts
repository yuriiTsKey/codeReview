import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { userFromJwt } from '../Interfaces/jwt.user.interface';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../Entities/user.entity';
import { Repository } from 'typeorm';

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

    if (!validAcessToken) {
      throw new Error('No acess token');
    }

    console.log(validAcessToken);
    const imputJwtUser = <userFromJwt>(
      jwt.verify(validAcessToken, process.env.ACCESS_KEY)
    );

    const currentUser = await this.user.findOne({ email: imputJwtUser.email });
    console.log(imputJwtUser.email + ' ' + imputJwtUser.email);
    console.log(imputJwtUser.exp);
    console.log(imputJwtUser.iat);

    return true;
  }
}
