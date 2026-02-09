import { Injectable, inject } from '@angular/core';
import { Database, ref, set, get, objectVal, push, update, remove } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private database = inject(Database);

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

  subscribe(path: string): Observable<unknown> {
    return objectVal(ref(this.database, path));
  }

  push(path: string, data: unknown) {
    const dbRef = ref(this.database, path);
    return push(dbRef, data);
  }

  update(path: string, data: Partial<unknown>): Promise<void> {
    return update(ref(this.database, path), data);
  }

  remove(path: string): Promise<void> {
    return remove(ref(this.database, path));
  }
}

