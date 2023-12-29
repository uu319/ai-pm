import { ConfigType } from '@nestjs/config';
import * as admin from 'firebase-admin';

import storageConfigObject from '../common/configs/storage.config';
import {
  FirebaseService,
  FirestoreFilter,
  FirestoreOrderBy,
} from '../common/types/firebase.type';
import {
  convertDocumentToModel,
  convertDocumentsToModels,
  getObjectFromModel,
} from './firebase-admin.utils';
import { Inject, Injectable } from '@nestjs/common';
import { FIREBASE_APP } from '../common/constants';

@Injectable()
export class FirebaseAdminService {
  constructor(
    private readonly storageConfig: ConfigType<typeof storageConfigObject>,
    @Inject(FIREBASE_APP) private firebaseApp: admin.app.App
  ) {}

  firebaseAdmin(): admin.app.App {
    return this.firebaseApp;
  }

  bucket() {
    return this.firebaseApp.storage().bucket(this.storageConfig.firebaseBucket);
  }

  async setService<T extends FirebaseService>(
    data: T,
    path: string,
    key: string,
    batch?: admin.firestore.WriteBatch
  ) {
    const target = getObjectFromModel(data);
    const ref = admin.firestore().collection(path).doc(key);

    if (batch) {
      batch?.set(ref, target, { merge: true });

      return ref.id;
    }

    await ref.set(target, { merge: true });

    return ref.id;
  }

  async saveService<T extends FirebaseService>(
    data: T,
    path: string,
    batch?: admin.firestore.WriteBatch
  ) {
    const target = getObjectFromModel(data);
    const ref = admin.firestore().collection(path);

    if (batch) {
      const docRef = ref.doc();

      batch?.set(docRef, target);

      return docRef.id;
    }

    const res = await ref.add(target);

    return res.id;
  }

  async readService<T extends FirebaseService>(
    path: string,
    filters?: FirestoreFilter[],
    orderBy?: FirestoreOrderBy
  ): Promise<T[]> {
    let query = admin
      .firestore()
      .collection(path)
      .where('deletedAt', '==', null);

    if (orderBy) {
      query = query.orderBy(orderBy.fieldPath, orderBy.directionStr);
    }

    if (filters) {
      filters.forEach((filter) => {
        query = query.where(filter.fieldPath, filter.opStr, filter.value);
      });
    }

    const results = await query.get();

    return convertDocumentsToModels<T>(results);
  }

  async updateService(key: string, data: FirebaseService, path: string) {
    const target = getObjectFromModel(data);

    return admin.firestore().collection(path).doc(key).update(target);
  }

  async getService<T extends FirebaseService>(
    key: string,
    path: string
  ): Promise<T> {
    const collection = await admin.firestore().collection(path).doc(key).get();

    if (collection.data()) {
      return convertDocumentToModel<T>(collection);
    }
  }

  async deleteService<T extends FirebaseService>(key: string, path: string) {
    const value = { deletedAt: new Date() };
    const data = await this.getService<T>(key, path);
    const target = Object.assign(data, value);

    return this.updateService(key, target, path);
  }
}
