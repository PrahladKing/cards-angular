import { Injectable, inject } from '@angular/core';
import { Database, ref, set, get, objectVal, push, update, remove, orderByChild, equalTo } from '@angular/fire/database';
import { Observable } from 'rxjs';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User
} from '@angular/fire/auth';

import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  limit,
  serverTimestamp
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private database = inject(Database);
  private firestore = inject(Firestore);
  private auth = inject(Auth);

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

  // firestore queries
   /* -------------------------
     SIGN UP
  ------------------------- */
  async signUp(
    email: string,
    password: string,
    username: string,
    displayName?: string
  ): Promise<User> {

    const usernameLower = username.toLowerCase();

    // 1️⃣ Reserve username
    const usernameRef = doc(this.firestore, 'usernames', usernameLower);
    const usernameSnap = await getDoc(usernameRef);

    if (usernameSnap.exists()) {
      throw new Error('Username already taken');
    }

    // 2️⃣ Create auth user
    const cred = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    const user = cred.user;

    // 3️⃣ Create Firestore user profile
    const userRef = doc(this.firestore, 'users', user.uid);

    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      username,
      username_lower: usernameLower,
      displayName: displayName || username,
      photoURL: user.photoURL || null,
      createdAt: serverTimestamp()
    });

    // 4️⃣ Lock username → uid
    await setDoc(usernameRef, {
      uid: user.uid
    });

    return user;
  }

  /* -------------------------
     LOGIN
  ------------------------- */
  async login(email: string, password: string): Promise<User> {
    const cred = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    return cred.user;
  }

  /* -------------------------
     LOGOUT
  ------------------------- */
  async logout(): Promise<void> {
    return signOut(this.auth);
  }

  /* -------------------------
     CURRENT USER PROFILE
  ------------------------- */
  async getCurrentUserProfile() {
    const user = this.auth.currentUser;
    if (!user) return null;

    const ref = doc(this.firestore, 'users', user.uid);
    const snap = await getDoc(ref);

    return snap.exists() ? snap.data() : null;
  }

  /* -------------------------
     GET USER BY USERNAME
  ------------------------- */
  async getUserByUsername(username: string) {
    const q = query(
      collection(this.firestore, 'users'),
      where('username_lower', '==', username.toLowerCase()),
      limit(1)
    );

    const snap = await getDocs(q);
    return snap.empty ? null : snap.docs[0].data();
  }
}

