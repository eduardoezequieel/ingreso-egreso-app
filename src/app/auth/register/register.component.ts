import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  registroForm!: FormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  crearUsuario(): void {
    Swal.fire({
      title: 'Espere por favor...',
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const { nombre, correo, password } = this.registroForm.value;

    if (this.registroForm.valid) {
      this.authService
        .crearUsuario(nombre, correo, password)
        .then(() => {
          Swal.close();
          this.router.navigateByUrl('/login');
        })
        .catch((error) => {
          Swal.fire({
            title: 'Alert!',
            text: error,
            icon: 'warning',
          });
        });
    }
  }
}
