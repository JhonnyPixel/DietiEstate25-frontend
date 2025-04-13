 // profile.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormsModule,ReactiveFormsModule } from '@angular/forms';

// Assumi che questo servizio esista già
import { ProfileService } from '../profile.service';

import { TitleCasePipe,NgClass,DatePipe } from '@angular/common';
import { AuthService } from '../auth.service';
import { AccountsBackendService } from '../accounts-backend.service';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye,faEyeSlash,faPen } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';


interface UserProfile {
  id?: string | number;
  firstName: string;
  lastName: string;
  email: string;
  bio:string;
  dob: string;
  password?: string;
  profilePicUrl?: string;
  ragioneSociale?: string;
  partitaIva?: string;
  role: 'CUSTOMER' | 'AGENT' | 'ADMIN' | 'MANAGER';
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  imports:[TitleCasePipe,NgClass,FormsModule,ReactiveFormsModule,DatePipe,NavbarComponent,FontAwesomeModule]
})
export class ProfileComponent implements OnInit {
  userProfile: UserProfile | null = null;
  profileForm: FormGroup;
  isEditing = false;
  showPassword=false;

  faEye=faEye
  faEyeSlash=faEyeSlash
  faPen=faPen

  newProfilePic:File|null=null
  
  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private router:Router,
    public auth:AuthService,
    private accountsService:AccountsBackendService,
    private toaster:ToastrService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required /*, Validators.email */]],
      dob: ['', Validators.required],
      password: [''],
      bio:[''],
      profilePicUrl: [''],
      ragioneSociale: [''],
      partitaIva: ['']
    });
  }

  ngOnInit(): void {
    // Carica i dati del profilo dal servizio

     this.profileService.getUserProfile().subscribe(
      (profile: UserProfile) => {

        profile.role=(this.auth.getRole() as UserProfile["role"])

        if(profile.role==='ADMIN'){
          profile.ragioneSociale=this.auth.getRagioneSociale()!
          profile.partitaIva=this.auth.getPartitaIva()!
        }

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
      dob: profile.dob,
    };

    if (profile.role === 'CUSTOMER') {
      formData.password = profile.password || '';
      formData.profilePicUrl = profile.profilePicUrl || '';
    } else if (profile.role === 'ADMIN') {
      formData.ragioneSociale = profile.ragioneSociale || '';
      formData.partitaIva = profile.partitaIva || '';
    } else if(profile.role === 'AGENT'){
      formData.bio = profile.bio
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


  deleteProfilePic(){
    if(this.userProfile?.profilePicUrl){
    this.profileService.deleteProfilePic().subscribe(
      data=>{
        console.log("foto profilo eliminata:",data)

        this.userProfile!.profilePicUrl=''
        this.cancelEditing()
      }
    )
  }
  }


  onPhotoUpload(event: any) {
    const files = event.target.files;
    if (files) {
      console.log("files: ",files)
      this.newProfilePic=files[0];

    }
  }

 

    saveProfile(): void {

      //foto profilo

      if(this.newProfilePic!==null){

      

          this.profileService.uploadProfilePic(this.newProfilePic).subscribe(
            data=>{
              console.log("foto profilo aggiunta: ",data)


              this.userProfile!.profilePicUrl=data
            }

            

          )

        this.newProfilePic=null //reset
        
      }


      //altri dati

      if (this.profileForm.valid && this.userProfile) {
        // Ottieni solo i campi che sono stati modificati e non sono vuoti
        const formValue = this.profileForm.value;
        const changedFields: Record<string, any> = {};
        
        // Controlla ogni campo nel form
        Object.keys(formValue).forEach(key => {
          const formField = formValue[key];
          const originalValue = this.userProfile?.[key as keyof UserProfile];
          
          // Includi solo se il valore è cambiato e non è vuoto
          if (formField !== originalValue && formField !== null && formField !== '') {
            changedFields[key] = formField;
          }
        });
        
        // Se non ci sono campi modificati, esci
        if (Object.keys(changedFields).length === 0) {
          this.isEditing = false;
          return;
        }
        
        
        
        // Escludi campi specifici che non devono essere inviati al backend
        const fieldsToExclude = ['id','role','profilePicUrl'];
        fieldsToExclude.forEach(field => {
          if (field in changedFields) {
            delete changedFields[field];
          }
        });
        
        // Invia solo i campi modificati al backend
        this.accountsService.updateUser(changedFields).subscribe(
          (response) => {

            console.log("Dati cambiati con successo:",response)

            if(changedFields['ragioneSociale']){
              localStorage.setItem('ragioneSociale',changedFields['ragioneSociale'])
            }

            if(changedFields['partitaIva']){
              localStorage.setItem('partitaIva',changedFields['partitaIva'])

            }

            if(changedFields['email'] || changedFields['password']){
              this.auth.logout();
              this.router.navigate(["/login"])
            }
            else if (this.userProfile) {
              // Aggiorna solo i campi specifici che sono stati modificati
              Object.keys(changedFields).forEach(key => {

                this.auth.setProfile(changedFields);
                (this.userProfile as any)[key] = changedFields[key];
              });
            }
            
            this.isEditing = false;
            // Mostra notifica di successo
            this.toaster.success('Modifiche applicate con successo')
          },
          error => {
            console.error('Errore durante l\'aggiornamento del profilo', error);
            this.toaster.error('Qualcosa è andato storto')
            // Mostra notifica di errore
          }
        );
      }
    }
} 