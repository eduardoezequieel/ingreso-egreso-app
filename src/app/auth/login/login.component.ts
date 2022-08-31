import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import * as ui from 'src/app/shared/ui.actions';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  loading = false;
  unsubscriber$ = new Subject();

  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.store
      .select('ui')
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((ui) => {
        this.loading = ui.isLoading;
      });
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next(true);
    this.unsubscriber$.complete();
  }

  login() {
    this.store.dispatch(ui.isLoading());

    // Swal.fire({
    //   title: 'Espere por favor...',
    //   didOpen: () => {
    //     Swal.showLoading();
    //   },
    // });

    const { email, password } = this.loginForm.value;

    if (this.loginForm.valid) {
      this.authService
        .loginUsuario(email, password)
        .then(() => {
          // Swal.close();
          this.store.dispatch(ui.stopLoading());
          this.router.navigateByUrl('/');
        })
        .catch((error) => {
          this.store.dispatch(ui.stopLoading());
          Swal.fire({
            title: 'Alert!',
            text: error,
            icon: 'warning',
          });
        });
    }
  }
}
