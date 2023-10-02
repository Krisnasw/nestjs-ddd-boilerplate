import * as dotenv from 'dotenv';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { LogLevel } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

import { I18nOptionsWithoutResolvers } from 'nestjs-i18n/dist/interfaces/i18n-options.interface';
import { IAwsConfig } from '@/interfaces/aws.interface';
import { ISwaggerConfigInterface } from '@/interfaces/swagger.interface';

export class SettingService {
  constructor() {
    dotenv.config({
      path: `.env`,
    });

    // Replace \\n with \n to support multiline strings in AWS
    for (const envName of Object.keys(process.env)) {
      process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
    }
    if (this.nodeEnv === 'development') {
      console.info(process.env);
    }
  }

  public get(key: string): string {
    return process.env[key];
  }

  public getNumber(key: string): number {
    return Number(this.get(key));
  }

  get app() {
    return {
      name: this.get('APP_NAME'),
      env: this.nodeEnv,
      version: this.get('API_VERSION'),
      versionDefault: this.get('API_VERSION_DEFAULT'),
      versionKey: this.get('API_VERSION_KEY') || 'x-api-version',
      url: this.get('API_URL'),
      cors: this.get('CORS'),
      prefix: this.apiPrefix,
      defaultLang: this.get('APP_DEFAULT_LANG') || 'en',
      authorizationKey: this.get('APP_AUTHORIZATION_KEY') || 'Authorization',
      timezone: this.get('APP_TIMEZONE') || '+07:00',
    };
  }

  get apiPrefix() {
    let prefix = this.get('API_PREFIX');
    if (!prefix) {
      prefix = '';
    }
    if (prefix == 'version') {
      prefix = this.get('API_VERSION');
    }
    return prefix;
  }

  get nodeEnv(): string {
    return this.get('NODE_ENV') || 'development';
  }

  get eventStoreConfig() {
    return {
      protocol: this.get('EVENT_STORE_PROTOCOL') || 'http',
      connectionSettings: {
        defaultUserCredentials: {
          username: this.get('EVENT_STORE_CREDENTIALS_USERNAME') || 'admin',
          password: this.get('EVENT_STORE_CREDENTIALS_PASSWORD') || 'changeit',
        },
        verboseLogging: true,
        failOnNoServerResponse: true,
        // log: console, // TODO: improve Eventstore logger (separate chanel)
      },
      tcpEndpoint: {
        host: this.get('EVENT_STORE_HOSTNAME') || 'localhost',
        port: this.getNumber('EVENT_STORE_TCP_PORT') || 1113,
      },
      httpEndpoint: {
        host: this.get('EVENT_STORE_HOSTNAME') || 'localhost',
        port: this.getNumber('EVENT_STORE_HTTP_PORT') || 2113,
      },
      poolOptions: {
        min: this.getNumber('EVENT_STORE_POOLOPTIONS_MIN') || 1,
        max: this.getNumber('EVENT_STORE_POOLOPTIONS_MAX') || 10,
      },
    };
  }

  get winstonConfig(): winston.LoggerOptions {
    const transports = [
      new DailyRotateFile({
        level: 'debug',
        filename: `./logs/${this.nodeEnv}/debug-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
      new DailyRotateFile({
        level: 'error',
        filename: `./logs/${this.nodeEnv}/error-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: false,
        maxSize: '20m',
        maxFiles: '30d',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
      new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp({
            format: 'DD-MM-YYYY HH:mm:ss',
          }),
          winston.format.simple(),
        ),
      }),
    ];

    return {
      transports,
      exitOnError: false,
    };
  }

  get redis() {
    return {
      host: this.get('REDIS_HOST') || '127.0.0.1',
      url: this.get('REDIS_URL'),
      port: this.get('REDIS_PORT') || '6379',
      password: this.get('REDIS_PASSWORD'),
      role: this.get('REDIS_ROLE'),
      user: this.get('REDIS_USER'),
      prefix: this.get('REDIS_PREFIX') || 'nest_cache:',
      connectionName: this.get('REDIS_CONNECTION_NAME') || 'NEST_CACHE',
      ttl: this.get('REDIS_TTL') || 3600,
      cacheTTL: {
        searchPlaceholder:
          this.getNumber('REDIS_CACHE_TTL_SEARCH_PLACEHOLDER') || 86400,
      },
      enable: {
        searchPlaceholder:
          this.get('REDIS_ENABLE_SEARCH_PLACEHOLDER') == 'true' || false,
      },
    };
  }

  get newrelic() {
    return {
      enabled: this.get('NEWRELIC_ENABLED') == 'true' || false,
      appName: this.get('NEWRELIC_APP_NAME') || this.get('APP_NAME'),
      licenseKey: this.get('NEWRELIC_LICENSE_KEY'),
      log: {
        level: this.get('NEWRELIC_LOG_LEVEL'),
      },
      distributeTracing: {
        enabled:
          this.get('NEWRELIC_DISTRIBUTE_TRACING_ENABLED') == 'true' || false,
      },
      transactionTracer: {
        enabled: this.get('NEWRELIC_TRANSACTION_ENABLED') == 'true' || false,
        recordSQL: this.get('NEWRELIC_TRANSACTION_RECORD_SQL'),
        explainThreshold: this.get('NEWRELIC_TRANSACTION_EXPLAIN_THRESHOLD'),
      },
      slowSql: {
        enabled: this.get('NEWRELIC_SLOW_SQL_ENABLED') == 'true' || false,
        maxSamples: this.get('NEWRELIC_SLOW_SQL_MAX_SAMPLES'),
      },
      blacklist: this.get('NEWRELIC_BLACKLIST_ROUTES')
        ? this.get('NEWRELIC_BLACKLIST_ROUTES').split(',')
        : [],
    };
  }

  get log() {
    let logLevels: LogLevel[] = ['log', 'warn', 'error', 'verbose', 'debug'];
    if (this.get('LOG_LEVELS')) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      logLevels = this.get('LOG_LEVELS').split(',');
    }

    return {
      enabled: this.get('LOG_ENABLED') == 'true' || false,
      driver: this.get('LOG_DRIVER') || 'google',
      name: this.get('LOG_NAME') || this.app.name,
      levels: logLevels,
      morgan: {
        enabled: this.get('LOG_MORGAN_ENABLED') == 'true' || false,
      },
    };
  }

  get headerKey() {
    return {
      appVersion: this.get('HEADER_APP_VERSION') || 'x-version',
      appPlatform: this.get('HEADER_APP_DEVICE') || 'x-device',
      timezone: this.get('HEADER_TIMEZONE') || 'x-timezone',
      lang: this.get('HEADER_LANG') || 'x-lang',
      userId: this.get('HEADER_USER_ID') || 'x-user-id',
      userUuid: this.get('HEADER_USER_UUID') || 'x-user-uuid',
    };
  }

  get rateLimit() {
    return {
      enabled: this.get('RATE_LIMIT_ENABLED') == 'true' || false,
      windowMs:
        this.getNumber('RATE_LIMIT_WINDOWMS') * 60 * 1000 || 15 * 60 * 1000,
      max: this.getNumber('RATE_LIMIT_MAX') || 300,
    };
  }

  get awsS3Config(): IAwsConfig {
    return {
      accessKeyId: this.get('AWS_S3_ACCESS_KEY_ID'),
      secretAccessKey: this.get('AWS_S3_SECRET_ACCESS_KEY'),
      bucketName: this.get('S3_BUCKET_NAME'),
      publicUrl: this.get('S3_PUBLIC_URL'),
    };
  }

  get i18nConfig(): I18nOptionsWithoutResolvers {
    return {
      fallbackLanguage: 'id',
      loaderOptions: {
        path: path.join(__dirname, '../../assets/i18n/'),
        watch: true,
      },
    };
  }

  get swaggerConfig(): ISwaggerConfigInterface {
    return {
      path: this.get('SWAGGER_PATH') || '/api/docs',
      title:
        this.get('SWAGGER_TITLE') || 'Talentclass API ',
      description:
        this.get('SWAGGER_DESCRIPTION') ||
        'Talentclass API Documentation',
      version: this.get('SWAGGER_VERSION') || '0.0.1',
      scheme: this.get('SWAGGER_SCHEME') === 'https' ? 'https' : 'http',
    };
  }

  get jwtConfig() {
    let privateKey = null;
    let publicKey = null;

    const privateKeyPath = path.join(
      __dirname,
      '..',
      'certificates',
      'auth-rs256.key',
    );
    const publicKeyPath = path.join(
      __dirname,
      '..',
      'certificates',
      'auth-rs256.key.pub',
    );

    if (fs.existsSync(privateKeyPath)) {
      privateKey = fs.readFileSync(privateKeyPath);
    } else {
      privateKey = this.get('JWT_TOKEN_SECRET_PRIVATE_KEY');
    }

    if (fs.existsSync(publicKeyPath)) {
      publicKey = fs.readFileSync(publicKeyPath);
    } else {
      publicKey = this.get('JWT_TOKEN_SECRET_PUBLIC_KEY');
    }

    return {
      secretKey: this.get('JWT_SECRET') || 'y0urS3cr3tz',
      refreshTokenSecret: this.get('JWT_REFRESH_TOKEN_SECRET') || 'y0urS3cr3tz',
      expiresToken: this.get('JWT_EXPIRES_TOKEN') || '14d',
      expiresRefreshToken: this.get('JWT_EXPIRES_REFRESH_TOKEN') || '30d',
      privateKey,
      publicKey,
    };
  }
}
