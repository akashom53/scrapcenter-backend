import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { AuthStore } from '../../../auth/state/auth.store';
import { AppStore } from '../../../state/app.store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  showPassword: boolean = false;
  errorMessage: string = '';
  private readonly authStore = inject(AuthStore)
  private readonly appStore = inject(AppStore)
  isLoading = this.appStore.isLoading;

  constructor(private router: Router, private authService: AuthService) { }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.errorMessage = '';
    // this.isLoading = true;

    // Basic validation
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password';
      // this.isLoading = false;
      return;
    }

    this.authStore.login({ email: this.email, password: this.password });
    // this.authService.login(this.email, this.password, false).subscribe({
    //   next: (response) => {
    //     console.log('Login successful', response);
    //     this.isLoading = false;
    //     // Navigate to home page after successful login
    //     this.router.navigate(['/home']);
    //   },
    //   error: (error) => {
    //     console.error('Login error', error);
    //     this.errorMessage = error.message || 'Login failed. Please try again.';
    //     this.isLoading = false;
    //   }
    // });
  }

  loginWithGoogle(): void {
    // Implement Google login logic
    console.log('Google login attempt');
  }

  ngOnInit(): void {
    this.authService.validateToken(false).subscribe(isValid => {
      if (isValid) {
        this.router.navigate(['/home']);
      }
    });
  }
}
