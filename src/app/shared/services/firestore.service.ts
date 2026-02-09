import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private firestore = inject(Firestore);

  async add(collectionName: string, data: unknown): Promise<string> {
    const docRef = await addDoc(collection(this.firestore, collectionName), data);
    return docRef.id;
  }

  async getAll(collectionName: string): Promise<unknown[]> {
    const querySnapshot = await getDocs(collection(this.firestore, collectionName));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  async getById(collectionName: string, id: string): Promise<unknown | null> {
    const docRef = doc(this.firestore, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    }
    return null;
  }

  async update(collectionName: string, id: string, data: Partial<unknown>): Promise<void> {
    const docRef = doc(this.firestore, collectionName, id);
    await updateDoc(docRef, data);
  }

  async delete(collectionName: string, id: string): Promise<void> {
    const docRef = doc(this.firestore, collectionName, id);
    await deleteDoc(docRef);
  }

  async queryByField(collectionName: string, field: string, value: string): Promise<unknown[]> {
    const q = query(collection(this.firestore, collectionName), where(field, '==', value));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
}
