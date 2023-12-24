import { Module } from '@nestjs/common';
import { VectorStoreController } from './vector-store.controller';
import { VectorStoreService } from './vector-store.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [MulterModule.register()],
  controllers: [VectorStoreController],
  providers: [VectorStoreService],
})
export class VectorStoreModule {}
