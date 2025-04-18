
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { RestBackendService } from '../rest-backend.service';
import { AccountsBackendService } from '../accounts-backend.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { faPenToSquare,faTrash } from '@fortawesome/free-solid-svg-icons';

export interface Account {
  id: string;
  name: string;
  lastname: string;
  email: string;
  dateOfBirth: string;
  password: string;
  type: 'Manager' | 'Agente';
}

@Component({
  selector: 'app-account-list',
  imports: [FormsModule, NavbarComponent,FontAwesomeModule],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.scss'
})
export class AccountListComponent implements OnInit {

  constructor(private restBackend: RestBackendService, private accountsBackend: AccountsBackendService) { }

  ngOnInit() {
    this.loadAccounts();
  }

  loadAccounts() {
    this.accounts = [];
    
    this.accountsBackend.getAgents().subscribe((data: any) => {
      console.log(data);
      const agents: Account[] = [];

      for (let key in data) {
        let agent = data[key];

        agents.push({
          id: agent.id,
          name: agent.firstName,
          lastname: agent.lastName,
          email: agent.email,
          dateOfBirth: agent.dob,
          password: '',
          type: 'Agente'
        });
      }

      this.accounts = this.accounts.concat(agents);
    });

    this.accountsBackend.getManagers().subscribe((data: any) => {
      console.log(data);
      const managers: Account[] = [];

      for (let key in data) {
        let manager = data[key];

        managers.push({
          id: manager.id,
          name: manager.firstName,
          lastname: manager.lastName,
          email: manager.email,
          dateOfBirth: manager.dob,
          password: '',
          type: 'Manager'
        });
      }

      this.accounts = this.accounts.concat(managers);
    });
  }

  agentsAccounts: Account[] = [];
  managersAccounts: Account[] = [];

  accounts: Account[] = [];

  showForm = false;
  isEditing = false;
  newAccount: Account = { id: '', name: '', lastname: '', email: '', dateOfBirth: '', password: '', type: 'Manager' };

  faPen=faPenToSquare
  faThrash=faTrash

  get managers(): Account[] {
    return this.accounts.filter(acc => acc.type === 'Manager');
  }

  get agents(): Account[] {
    return this.accounts.filter(acc => acc.type === 'Agente');
  }

  addAccount() {
    if (this.newAccount.type == 'Agente') {
      this.restBackend.createAgent({
        firstName: this.newAccount.name,
        lastName: this.newAccount.lastname,
        email: this.newAccount.email,
        dob: this.newAccount.dateOfBirth,
        password: this.newAccount.password,
      }).subscribe((data: any) => {
        console.log("ho fatto la chiamata a createAgent: ", data)

        this.newAccount.id = data.id;
        this.accounts.push({ ...this.newAccount });
        this.resetForm();
        this.showForm=false;
      });
    } else if (this.newAccount.type == 'Manager') {
      this.restBackend.createManager({
        firstName: this.newAccount.name,
        lastName: this.newAccount.lastname,
        email: this.newAccount.email,
        dob: this.newAccount.dateOfBirth,
        password: this.newAccount.password,
      }).subscribe((data: any) => {
        console.log("ho fatto la chiamata a createManager: ", data)

        this.newAccount.id = data.id;
        this.accounts.push({ ...this.newAccount });
        this.resetForm();
        this.showForm=false;
      });
    }
  }

  editAccount(account: Account) {
    this.newAccount = { ...account };
    this.showForm = true;
    this.isEditing = true;
  }

  updateAccount() {
    if (this.newAccount.type === 'Agente') {
      this.accountsBackend.updateAgent(this.newAccount.id, {
        firstName: this.newAccount.name,
        lastName: this.newAccount.lastname,
        email: this.newAccount.email,
        dob: this.newAccount.dateOfBirth,
        password: this.newAccount.password,
      }).subscribe((response: any) => {
        console.log("Agent updated: ", response);
        const index = this.accounts.findIndex(acc => acc.id === this.newAccount.id);
        if (index !== -1) {
          this.accounts[index] = { ...this.newAccount };
        }
        this.resetForm();
        this.showForm=false;
      });
    } else if (this.newAccount.type === 'Manager') {
      this.accountsBackend.updateManager(this.newAccount.id, {
        firstName: this.newAccount.name,
        lastName: this.newAccount.lastname,
        email: this.newAccount.email,
        dob: this.newAccount.dateOfBirth,
        password: this.newAccount.password,
      }).subscribe((response: any) => {
        console.log("Manager updated: ", response);
        const index = this.accounts.findIndex(acc => acc.id === this.newAccount.id);
        if (index !== -1) {
          this.accounts[index] = { ...this.newAccount };
        }
        this.resetForm();
        this.showForm=false;
      });
    }
  }

  resetForm() {
    this.newAccount = { id: '', name: '', lastname: '', email: '', dateOfBirth: '', password: '', type: 'Manager' };
    /* this.showForm = false; */
    this.isEditing = false;
  }

  saveAccount() {
    if (this.isEditing) {
      this.updateAccount();
    } else {
      this.addAccount();
    }
  }

  deleteAccount(account: Account) {
    if (account.type === "Manager") {
      this.accountsBackend.deleteManager(account.id).subscribe(data => {
        console.log("risultato: ", data);
        this.accounts = this.accounts.filter(acc => acc.id !== account.id);
      });
    } else {
      this.accountsBackend.deleteAgent(account.id).subscribe(data => {
        console.log("risultato: ", data);
        this.accounts = this.accounts.filter(acc => acc.id !== account.id);
      });
    }
  }
}
