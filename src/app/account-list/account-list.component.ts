import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { RestBackendService } from '../rest-backend.service';

interface Account {
  id: number;
  name: string;
  lastname: string;
  email: string;
  dateOfBirth: string;
  password: string;
  profilePicture: string;
  type: 'Manager' | 'Agente';
}

@Component({
  selector: 'app-account-list',
  imports: [FormsModule,NavbarComponent],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.scss'
})
export class AccountListComponent {

  constructor(private restBackend:RestBackendService){}


  accounts: Account[] = [
    { id: 1, name: 'Mario', lastname: 'Rossi', email: 'mario.rossi@example.com', dateOfBirth: '1980-01-01', password: '', profilePicture: '', type: 'Manager' },
    { id: 2, name: 'Luigi', lastname: 'Verdi', email: 'luigi.verdi@example.com', dateOfBirth: '1985-05-15', password: '', profilePicture: '', type: 'Agente' },
    { id: 3, name: 'Anna', lastname: 'Bianchi', email: 'anna.bianchi@example.com', dateOfBirth: '1990-07-20', password: '', profilePicture: '', type: 'Manager' },
    { id: 4, name: 'Carlo', lastname: 'Neri', email: 'carlo.neri@example.com', dateOfBirth: '1995-10-10', password: '', profilePicture: '', type: 'Agente' }
  ];

  showForm = false;
  newAccount: Account = { id: 0, name: '', lastname: '', email: '', dateOfBirth: '', password: '', profilePicture: '', type: 'Manager' };

  get managers(): Account[] {
    return this.accounts.filter(acc => acc.type === 'Manager');
  }

  get agents(): Account[] {
    return this.accounts.filter(acc => acc.type === 'Agente');
  }

  addAccount() {

    if(this.newAccount.type=='Agente'){
      this.restBackend.createAgent({
        firstName:this.newAccount.name,
        lastName:this.newAccount.lastname,
        email:this.newAccount.email,
        dob:this.newAccount.dateOfBirth,
        password:this.newAccount.password,
        profilePicUrl:this.newAccount.profilePicture,
      }).subscribe(data=>{
        console.log("ho fatto la chiamata a createAgent: ",data)
      })
    }

    this.newAccount.id = this.accounts.length + 1;
    this.accounts.push({ ...this.newAccount });
    this.newAccount = { id: 0, name: '', lastname: '', email: '', dateOfBirth: '', password: '', profilePicture: '', type: 'Manager' };
    this.showForm = false;
  }

  deleteAccount(id: number) {
    this.accounts = this.accounts.filter(account => account.id !== id);
  }
}
