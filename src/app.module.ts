import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';
import { environmentConfig } from './app/common/config/environment.config';
import { MongooseModule } from '@nestjs/mongoose';
import { RestModule } from './app/rest/rest.module';

const envPath = path.resolve('.env');

@Module({
  imports: [
    RestModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envPath,
      ignoreEnvFile: process.env.READ_LOCAL_ENV === 'true',
      load: [
        environmentConfig
      ]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URL');
        const dbName = configService.get<string>('MONGO_DB_NAME');

        return {
          uri,
          ...(dbName ? { dbName } : {}),
        };
      },
    })
  ],
})
export class AppModule { }
