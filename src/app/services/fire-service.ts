import { inject, Injectable } from '@angular/core';
import { Database, listVal, objectVal, push, ref, set, update } from '@angular/fire/database';
import { User } from '../components/fire/fire';

@Injectable({
  providedIn: 'root',
})
export class FireService {
  private DATABASE_NAME = 'users';
  private database = inject(Database);
  
  getUsers() {
    const userRef = ref(this.database, this.DATABASE_NAME);
    const users$ = listVal<User>(userRef);
    return users$;
  }

  addUser(user: User) {
    const userRef = ref(this.database, this.DATABASE_NAME)
    const idRef = push(userRef, user);
    update(idRef, {id: idRef.key});
    return idRef;
  }
}
