import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormGroup,FormControl,Validators,ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [NavbarComponent,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private authService:AuthService){}

  adminLogin:boolean=false

  loginForm = new FormGroup({
          email: new FormControl('', Validators.required),
          password: new FormControl('', Validators.required),
      })

  activateAdminLogin(value:boolean){
    this.adminLogin=value
  }

  loginAdmin(){
    if(this.loginForm.valid) {
      const formValues = this.loginForm.value;
      const data = {
        email: formValues.email!,
        password: formValues.password!
      };

      this.authService.loginAdmin(data).subscribe(data=>{
        console.log(data)
        localStorage.setItem("token",data.token)
        localStorage.setItem("id",data.id)
        localStorage.setItem("email",data.email)

        this.authService.getAgency(data.id).subscribe(agencyData=>{
          console.log("dati sull agenzia: ",agencyData);
          localStorage.setItem("agencyId",agencyData.id);
        })
      })

      

    } else {
      console.error('Il modulo di registrazione non è valido');
    }
  }

}
