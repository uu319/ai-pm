import { MiddlewareConsumer, Module } from '@nestjs/common';

import { VectorStoreModule } from '../vector-store/vector-store.module';
import { ChatModule } from '../chat/chat.module';
import { FirebaseAdminModule } from '../firebase-admin/firebase-admin.module';
import { CurrentUserMiddleware } from '../common/middlewares/current-user.middleware';
import { WarmupModule } from '../warmup';
import { HealthcheckModule } from '../healthcheck';
import { ConfigModule } from '@nestjs/config';
import { StorageModule } from '../storage/storage.module';
import { VectorDatabaseModule } from '../vector-database/vector-database.module';

@Module({
  imports: [
    WarmupModule,
    HealthcheckModule,
    VectorStoreModule,
    ChatModule,
    FirebaseAdminModule,
    ConfigModule.forRoot(),
    StorageModule,
    VectorDatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
