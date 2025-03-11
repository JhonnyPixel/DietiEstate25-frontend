import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component'; 
import { FormGroup,FormControl,Validators,ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  imports: [NavbarComponent,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  constructor(private authService:AuthService){}

  adminRegister:boolean=false

  registerForm = new FormGroup({
        firstName: new FormControl('a', Validators.required),
        lastName: new FormControl('', Validators.required),
        dateOfBirth: new FormControl('', Validators.required),
        email: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
        ragioneSociale: new FormControl('', Validators.required),
        partitaIva: new FormControl('', Validators.required),
    })

  activateAdminRegister(value:boolean){
    this.adminRegister=value
  }

  register(){
    if(this.registerForm.valid) {
      const formValues = this.registerForm.value;
      const data = {
        firstName: formValues.firstName!,
        lastName: formValues.lastName!,
        dateOfBirth: formValues.dateOfBirth!,
        email: formValues.email!,
        password: formValues.password!,
        ragioneSociale: formValues.ragioneSociale!,
        partitaIva: formValues.partitaIva!,
      };
      this.authService.registerAdmin(data);
    } else {
      console.error('Il modulo di registrazione non è valido');
    }
  }

}
