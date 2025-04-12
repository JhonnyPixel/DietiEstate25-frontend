import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component'; 
import { FormGroup,FormControl,Validators,ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { error } from 'console';

@Component({
  selector: 'app-register',
  imports: [NavbarComponent,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{

  constructor(private authService:AuthService,private route:ActivatedRoute,private router:Router,private toaster:ToastrService){}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const type = params.get('type');
      console.log('Tipo di registrazione cambiato:', type);
  
      this.adminRegister= (type==='adm')
    });
  }


  adminRegister:boolean=false

  registerForm = new FormGroup({
        firstName: new FormControl('', Validators.required),
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
    if(this.adminRegister){
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
      this.authService.registerAdmin(data).subscribe(data=>{
        console.log(data);
        this.router.navigateByUrl("/login")
        this.toaster.success('Registrazione andata a buon fine')
      },
      error=>{
        this.toaster.error('Impossibile eseguire la registrazione')
      })
    } else {
      console.error('Il modulo di registrazione non è valido');
      this.toaster.error('Il modulo di registrazione non è valido')
    }
  }
  else{
    const formValues = this.registerForm.value;
    const data = {
      firstName: formValues.firstName!,
      lastName: formValues.lastName!,
      dateOfBirth: formValues.dateOfBirth!,
      email: formValues.email!,
      password: formValues.password!,
    };
    this.authService.registerUser(data).subscribe(data=>{
      console.log(data);
      this.router.navigateByUrl("/login")
      this.toaster.success('Registrazione andata a buon fine')
    },
  error=>{
    this.toaster.error('Impossibile eseguire la registrazione')
  })
  }
}

}
