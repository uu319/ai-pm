import { MiddlewareConsumer, Module } from '@nestjs/common';

import { VectorStoreModule } from '../vector-store/vector-store.module';
import { ChatModule } from '../chat/chat.module';
import { FirebaseAdminModule } from '../firebase-admin/firebase-admin.module';
import { CurrentUserMiddleware } from '../common/middlewares/current-user.middleware';
import { ConfigModule } from '@nestjs/config';
import { firebaseAdminConfig } from '../common/configs/firebase-admin.config';
import { WarmupModule } from '../warmup';
import { HealthcheckModule } from '../healthcheck';

@Module({
  imports: [
    WarmupModule,
    HealthcheckModule,
    VectorStoreModule,
    ChatModule,
    FirebaseAdminModule,
    ConfigModule.forFeature(firebaseAdminConfig),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
