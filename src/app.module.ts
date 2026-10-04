import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; 
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module'; 
import { BasketModule } from './basket/basket.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    PrismaModule,
    UsersModule,
    AuthModule,
    BasketModule,
    ProductModule,
    CategoryModule, 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
