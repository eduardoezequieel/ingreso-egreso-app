import { Usuario } from './../models/usuario.model';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { EMPTY, map, mergeMap, of, switchMap, take, tap } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { setUser, unsetUser } from '../auth/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public auth: AngularFireAuth,
    public firestore: AngularFirestore,
    private store: Store<AppState>
  ) {}

  initAuthListener() {
    this.auth.authState
      .pipe(
        switchMap((fuser) => {
          if (fuser) {
            return this.firestore.doc(`${fuser.uid}/usuario`).valueChanges();
          } else {
            return of(fuser);
          }
        }),
        tap((nodeUser) => {
          if (nodeUser) {
            const user = Usuario.fromFirebase(nodeUser);
            this.store.dispatch(setUser({ user }));
          } else {
            this.store.dispatch(unsetUser());
          }
        })
      )
      .subscribe(console.log);
  }

  crearUsuario(nombre: string, email: string, password: string) {
    return this.auth
      .createUserWithEmailAndPassword(email, password)
      .then((data) => {
        const newUser = new Usuario(data.user?.uid!, nombre, data.user?.email!);

        return this.firestore
          .doc(`${data.user?.uid}/usuario`)
          .set({ ...newUser });
      });
  }

  loginUsuario(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(map((user) => user != null));
  }
}
