import { Subject, takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import * as ui from 'src/app/shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit, OnDestroy {
  registroForm!: FormGroup;
  unsubscriber$ = new Subject();
  loading = false;

  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.store
      .select('ui')
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((ui) => (this.loading = ui.isLoading));
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next(true);
    this.unsubscriber$.complete();
  }

  crearUsuario(): void {
    this.store.dispatch(ui.isLoading());

    // Swal.fire({
    //   title: 'Espere por favor...',
    //   didOpen: () => {
    //     Swal.showLoading();
    //   },
    // });

    const { nombre, correo, password } = this.registroForm.value;

    if (this.registroForm.valid) {
      this.authService
        .crearUsuario(nombre, correo, password)
        .then(() => {
          // Swal.close();
          this.store.dispatch(ui.stopLoading());
          this.router.navigateByUrl('/login');
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
