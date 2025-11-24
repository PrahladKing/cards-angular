import { Component, inject } from '@angular/core';
import { FireService } from '../../services/fire-service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-fire',
  imports: [AsyncPipe],
  templateUrl: './fire.html',
  styleUrl: './fire.scss',
})
export class Fire {

  private fireS = inject(FireService);

  users$: Observable<User[]> | null = null
  getUsers() {
    this.users$ = this.fireS.getUsers();
  }

  addUser() {
    const user: User = {
      name: "sai",
      password: "single_sinthakaya",
      id: ''
    }
    this.fireS.addUser(user).then((ref) => {
      user.id = ref.key ?? '';
      console.log('user added', user)
    })
  }

}


export interface User {
  name: string, 
  password: string,
  id: string
}