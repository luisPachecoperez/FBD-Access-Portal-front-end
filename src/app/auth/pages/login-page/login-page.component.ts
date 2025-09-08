import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder,ReactiveFormsModule,Validators} from '@angular/forms';
//import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-login-page',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-component.css']
})
export class LoginPageComponent {
  /*
  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);

  authService = inject(AuthService);
  router = inject(Router);

  loginForm = this.fb.group({
    email: ['',[Validators.required,Validators.email]],
    password: ['',[Validators.required,Validators.minLength(6)]]
  });

  onSubmit() {
    console.log("Hola miguel");
    if( this.loginForm.invalid ){
      console.log(this.loginForm.value);
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
      return;
    }
    const { email = '', password = '' } = this.loginForm.value;

    console.log({ email, password });

    this.authService.login(email!, password!).subscribe(( isAuthenticated ) =>{
        if( isAuthenticated ){
          this.router.navigateByUrl('/');
          return;
        }
        this.hasError.set(true);
          setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
    });


  }
        */
}
