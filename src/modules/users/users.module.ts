import { Module } from '@nestjs/common';

import { PrismaService } from '@/shared/prisma/prisma.service';
import { UserController } from '@/modules/users/controllers/user.controller';
import { UserRepository } from '@/modules/users/repository/user.repository';
import { UserService } from '@/modules/users/services/user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, PrismaService],
})
export class UserModule {}
