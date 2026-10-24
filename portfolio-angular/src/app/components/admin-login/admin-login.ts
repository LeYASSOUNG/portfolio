import { Component, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css'
})
export class AdminLogin implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  errorMessage = signal('');
  isLoading = signal(false);

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    // Si déjà connecté, rediriger directement vers le dashboard
    if (this.apiService.getToken()) {
      this.router.navigate(['/admin']);
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    const credentials = this.loginForm.value as { email: string; password: string };

    this.apiService.login(credentials).subscribe({
      next: (res) => {
        this.apiService.setToken(res.token);
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.errorMessage.set('Identifiants invalides.');
        this.isLoading.set(false);
      }
    });
  }
}
