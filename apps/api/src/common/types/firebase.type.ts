/* eslint-disable @typescript-eslint/no-explicit-any */

import { firestore } from 'firebase-admin';

export type OrderByDirection = 'asc' | 'desc';

export type Document = firestore.DocumentData;

export type Iterable = { [key: string]: any };

export type FirebaseService = {
  document?: Document;
};

export type FirestoreFilter = {
  fieldPath: string | firestore.FieldPath;
  opStr: firestore.WhereFilterOp;
  value: any;
};

export type FirestoreOrderBy = {
  fieldPath: string | firestore.FieldPath;
  directionStr: OrderByDirection;
};

export type BaseFirebaseModel = FirebaseService & {
  id?: string;
  createdAt?: firestore.Timestamp;
  deletedAt?: firestore.Timestamp | null;
  document?: firestore.DocumentData;
  updatedAt?: firestore.Timestamp | null;
};

export enum FirebaseErrorCode {
  PERMISSION_DENIED = 'firestore/permission-denied',
}
