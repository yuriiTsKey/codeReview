import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { AuthModule } from './Auth/auth.module';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './Auth/Entities/user.entity';
import * as Joi from 'joi';
import { ScheduleModule } from '@nestjs/schedule';
import { MailModule } from './mail/mail.module';
import { MailconfirmationModule } from './mailconfirmation/mailconfirmation.module';
import { JwtmoduleModule } from './jwtmodule/jwtmodule.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        TYPEORM_HOST: Joi.string().required(),
        TYPEORM_USERNAME: Joi.string().required(),
        TYPEORM_PASSWORD: Joi.string().required(),
        TYPEORM_DATABASE: Joi.string().required(),

        EMAIL_SERVICE: Joi.string().required(),
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),

        EMAIL_CONFIRMATION_URL: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      sortSchema: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.TYPEORM_HOST,
      port: 5432,
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      migrationsRun: true,
      logging: true,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
