/* eslint-disable @typescript-eslint/no-explicit-any */
import * as admin from 'firebase-admin';
import { FirebaseService } from '../common/types/firebase.type';

export const convertDocumentToModel = <T extends FirebaseService>(
  doc: admin.firestore.DocumentData
): T => ({
  ...doc.data(),
});

export function getObjectFromModel<T extends FirebaseService>(t: T) {
  const keys = Object.getOwnPropertyNames(t);
  const target: T = { ...t };

  keys.forEach((key) => {
    if (t[key as keyof T] && t[key as keyof T] instanceof Array) {
      const arr = target[key as keyof T] as unknown as Array<any>;
      // eslint-disable-next-line @typescript-eslint/ban-types
      const newArray = new Array<Object>();
      if (typeof arr[0] === 'object') {
        arr.forEach((element: any) => {
          newArray.push({ ...element });
        });
        (target as any)[key] = newArray;
      } else {
        arr.forEach((element: any) => {
          newArray.push(element);
        });
        (target as any)[key] = newArray;
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { document, ...newTarget } = target;

  return newTarget;
}

export function convertDocumentsToModels<T extends FirebaseService>(
  array: admin.firestore.QuerySnapshot<admin.firestore.DocumentData>
) {
  const result = new Array<FirebaseService>();

  array.forEach((doc) => {
    result.push(convertDocumentToModel<T>(doc));
  });

  return result as T[];
}
