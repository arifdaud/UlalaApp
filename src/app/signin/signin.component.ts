import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent {
  showInfo: boolean = false;
  signInForm: FormGroup;
  isHovered: boolean = false;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
  signIn() {
    if (this.signInForm.valid) {
      const credentials = {
        username: this.signInForm.value.email,
        password: this.signInForm.value.password,
      };
  
      this.http.post('http://test-demo.aemenersol.com/api/account/login', credentials)
        .subscribe(
          (response: any) => {
            const token = response.access_token;             
            // Set token in AuthService
            this.authService.setBearerToken(token);
            this.authService.setAuthenticated(true);           
            // Redirect to dashboard upon successful authentication
            this.router.navigate(['/dashboard']);
          },
          (error) => {
            console.error('Sign In Error:', error);
          }
        );
    } else {
      console.log('Form is invalid');
    }
  } 
}