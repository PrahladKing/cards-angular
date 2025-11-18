import { Injectable, inject } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase, Database, ref, set, get, onValue, off, push, update, remove } from 'firebase/database';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private database: Database;

  constructor() {
    const app = initializeApp(environment.firebase);
    this.database = getDatabase(app);
  }

  getDatabase(): Database {
    return this.database;
  }

  async set(path: string, data: unknown): Promise<void> {
    await set(ref(this.database, path), data);
  }

  async get(path: string): Promise<unknown> {
    const snapshot = await get(ref(this.database, path));
    return snapshot.val();
  }

  subscribe(path: string, callback: (data: unknown) => void): () => void {
    const dbRef = ref(this.database, path);
    onValue(dbRef, (snapshot) => {
      callback(snapshot.val());
    });
    return () => off(dbRef);
  }

  push(path: string, data: unknown): Promise<string> {
    return new Promise((resolve) => {
      const newRef = push(ref(this.database, path), data);
      resolve(newRef.key || '');
    });
  }

  update(path: string, data: Partial<unknown>): Promise<void> {
    return update(ref(this.database, path), data);
  }

  remove(path: string): Promise<void> {
    return remove(ref(this.database, path));
  }
}

