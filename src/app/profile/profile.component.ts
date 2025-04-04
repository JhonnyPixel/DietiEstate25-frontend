 // profile.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormsModule,ReactiveFormsModule } from '@angular/forms';

// Assumi che questo servizio esista già
import { ProfileService } from '../profile.service';

import { TitleCasePipe,NgClass,DatePipe } from '@angular/common';
import { AuthService } from '../auth.service';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  password?: string;
  profilePicUrl?: string;
  tempPassword?: string;
  ragioneSociale?: string;
  partitaIva?: string;
  role: 'CUSTOMER' | 'AGENT' | 'ADMIN' | 'MANAGER';
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  imports:[TitleCasePipe,NgClass,FormsModule,ReactiveFormsModule,DatePipe]
})
export class ProfileComponent implements OnInit {
  userProfile: UserProfile | null = null;
  profileForm: FormGroup;
  isEditing = false;
  
  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,

    private auth:AuthService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dob: ['', Validators.required],
      password: [''],
      profilePicUrl: [''],
      tempPassword: [''],
      ragioneSociale: [''],
      partitaIva: ['']
    });
  }

  ngOnInit(): void {
    // Carica i dati del profilo dal servizio

     this.profileService.getUserProfile().subscribe(
      (profile: UserProfile) => {

        console.log("arrivati i dati profilo",profile)
        this.userProfile = profile;
        this.initializeForm(profile);
      },
      error => {
        console.error('Errore durante il caricamento del profilo', error);
      }
    ); 

/* 
    let userData=this.auth.getUserData();

    if(userData){

      let parsedUserData=JSON.parse(userData);

      this.userProfile = (parsedUserData as UserProfile);
      this.userProfile.role='admin'
      this.initializeForm(parsedUserData);

    } */



  }

  initializeForm(profile: UserProfile): void {
    // Inizializza il form con i dati del profilo
    const formData: any = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      dob: profile.dob
    };

    if (profile.role === 'CUSTOMER') {
      formData.password = profile.password || '';
      formData.profilePicUrl = profile.profilePicUrl || '';
    } else if (profile.role === 'ADMIN') {
      formData.tempPassword = profile.tempPassword || '';
      formData.ragioneSociale = profile.ragioneSociale || '';
      formData.partitaIva = profile.partitaIva || '';
    }

    this.profileForm.patchValue(formData);
  }

  startEditing(): void {
    this.isEditing = true;
  }

  cancelEditing(): void {
    this.isEditing = false;
    if (this.userProfile) {
      this.initializeForm(this.userProfile);
    }
  }

  saveProfile(): void {
    if (this.profileForm.valid && this.userProfile) {
      const updatedProfile = {
        ...this.userProfile,
        ...this.profileForm.value
      };
      
      // Rimuovi campi non necessari in base al ruolo
      if (this.userProfile.role !== 'CUSTOMER') {
        delete updatedProfile.password;
        delete updatedProfile.profilePicUrl;
      }
      
      if (this.userProfile.role !== 'ADMIN') {
        delete updatedProfile.tempPassword;
        delete updatedProfile.ragioneSociale;
        delete updatedProfile.partitaIva;
      }

      this.profileService.updateUserProfile(updatedProfile).subscribe(
        (response) => {
          this.userProfile = updatedProfile;
          this.isEditing = false;
          // Mostra notifica di successo
        },
        error => {
          console.error('Errore durante l\'aggiornamento del profilo', error);
          // Mostra notifica di errore
        }
      );
    }
  }
} 