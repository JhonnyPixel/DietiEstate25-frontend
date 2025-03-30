import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormGroup,FormControl,Validators,ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-login',
  imports: [NavbarComponent,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private authService:AuthService,private notification:NotificationService){}


  loginForm = new FormGroup({
          email: new FormControl('', Validators.required),
          password: new FormControl('', Validators.required),
      })


  login(){
    if(this.loginForm.valid) {
      const formValues = this.loginForm.value;
      const data = {
        email: formValues.email!,
        password: formValues.password!
      };

      this.authService.login(data).subscribe(data=>{
        console.log(data)
        localStorage.setItem("token",data.token)
        localStorage.setItem("id",data.id)
        localStorage.setItem("email",data.email)
        localStorage.setItem("role",data.role)

        this.notification.initialize(); //recupera la notifiche all' accesso

        if(this.authService.getRole()!=="CUSTOMER"){

          this.authService.getAgency(data.id).subscribe(agencyData=>{
            console.log("dati sull agenzia: ",agencyData);
            localStorage.setItem("agencyId",agencyData.id);
          })
        }
      
    })
      

      

    } else {
      console.error('Il modulo di registrazione non è valido');
    }
  }

}
