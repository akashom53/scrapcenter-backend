import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service'; // Adjusted path

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'] // Assuming you'll create a similar CSS file
})
export class SignupComponent implements OnInit {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    // Optional: Check if user is already logged in and redirect
    // this.authService.validateToken(false).subscribe(isValid => {
    //   if (isValid) {
    //     this.router.navigate(['/home']); // Or to another appropriate page
    //   }
    // });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.isLoading = true;

    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields.';
      this.isLoading = false;
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      this.isLoading = false;
      return;
    }

    this.authService.signup(this.email, this.password, this.name).subscribe({
      next: (response) => {
        console.log('Signup successful', response);
        this.isLoading = false;
        // Navigate to login page after successful signup
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Signup error', error);
        this.errorMessage = error.message || 'Signup failed. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
