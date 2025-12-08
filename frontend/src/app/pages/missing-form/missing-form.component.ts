import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MissingService } from '../../services/missing.service';
import { AuthService } from '../../services/auth.service';



//interface pour une missing personne
interface MissingPerson {
  firstname: string;       
  lastname: string;        
  age: number;
  gender: string;           
  lastSeenDate: Date;      
  lastSeenLocation: string;
  description: string;
  photoUrl?: string;
  faceId?: string;
  status: string;           // 'PENDING' | 'APPROVED' | 'REJECTED'
  contactNumber: string;    
  contactEmail: string; 
  relationship: string;     // Relationship enum 'CHILD'|'PARENT'|'SIBLING'|'...'
  address?: string;         // Optionnel
}


@Component({
  selector: 'app-missing-form',
  imports: [    CommonModule, ReactiveFormsModule, RouterModule, MatFormFieldModule, 
    MatInputModule,  MatSelectModule, MatButtonModule, MatIconModule, MatDatepickerModule, MatNativeDateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './missing-form.component.html',
  styleUrl: './missing-form.component.css'
})
export class MissingFormComponent implements OnInit  {

  
  genderOptions = ['MALE', 'FEMALE'];
  relationshipOptions = ['PARENT','SPOUSE','CHILD','SIBLING','FRIEND','GUARDIAN','OTHER'];
  statusOptions = ['PENDING', 'APPROVED', 'REJECTED'];

  // protected readonly value = signal('');

  // protected onInput(event: Event) {
  //   this.value.set((event.target as HTMLInputElement).value);
  // }

  //formm group
  missingForm!:FormGroup;
  isLoading=false;
  errorMessage = '';
  successMessage = '';
  selectedFile: File | null = null;
  filePreview: string | null = null;

  constructor(private fb:FormBuilder,private authService:AuthService,private router:Router,private missingService:MissingService){}

  ngOnInit(): void {

    this.missingForm = this.fb.group({
        firstname: ['', Validators.required],      
      lastname: ['', Validators.required],       
      age: ['', [Validators.required, Validators.min(0), Validators.max(150)]],
      gender: ['', Validators.required],
      lastSeenDate: ['', Validators.required],   
      lastSeenLocation: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
      photoUrl: [''],
      faceId: [''],
      contactNumber: ['', Validators.required],   
      contactEmail: ['', [Validators.required, Validators.email]], 
      relationship: ['', Validators.required],
      address: ['']  



    })}
    //sumbit le formulaire
    onSubmit(): void {
  if (this.missingForm.invalid) {
    this.errorMessage = 'Please fill in all required fields';
    return;
  }

  // CHECK IF USER IS AUTHENTICATED
  if (!this.authService.isAuthenticated()) {
    this.errorMessage = 'You must be logged in to create a report';
    
    
    if (!this.router.url.includes('/login')) {
      this.router.navigate(['/login']);
    }
    
    return;
  }

  this.isLoading = true;
  this.errorMessage = '';
  this.successMessage = '';

  // If file is selected, use multipart upload endpoint
  if (this.selectedFile) {
    this.uploadWithPhoto();
  } else {
    // Otherwise, create without photo
    const formData = this.missingForm.value;
    this.missingService.createReport(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Report created successfully!';
        setTimeout(() => {
          this.router.navigate(['/user-page']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Error creating report. Please try again.';
        
        // If 401 error (not authenticated), redirect to login
        if (error.status === 401 && !this.router.url.includes('/login')) {
          this.router.navigate(['/login']);
        }
      }
    });
  }
}

private uploadWithPhoto(): void {
  const formData = new FormData();
  const form = this.missingForm.value;
  
  // Add all form fields to FormData
  formData.append('firstname', form.firstname);
  formData.append('lastname', form.lastname);
  formData.append('age', form.age);
  formData.append('gender', form.gender);
  formData.append('lastSeenDate', form.lastSeenDate instanceof Date 
    ? form.lastSeenDate.toISOString().split('T')[0]
    : form.lastSeenDate);
  formData.append('lastSeenLocation', form.lastSeenLocation);
  formData.append('description', form.description);
  formData.append('contactNumber', form.contactNumber);
  formData.append('contactEmail', form.contactEmail);
  formData.append('relationship', form.relationship);
  formData.append('address', form.address || '');
  formData.append('file', this.selectedFile!);
  
  this.missingService.createReportWithPhoto(formData).subscribe({
    next: (response) => {
      this.isLoading = false;
      this.successMessage = 'Report created successfully with photo!';
      setTimeout(() => {
        this.router.navigate(['/user-page']);
      }, 2000);
    },
    error: (error) => {
      this.isLoading = false;
      this.errorMessage = error.message || 'Error creating report. Please try again.';
      
      if (error.status === 401 && !this.router.url.includes('/login')) {
        this.router.navigate(['/login']);
      }
    }
  });
}

onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  const files = input.files;
  
  if (files && files.length > 0) {
    this.selectedFile = files[0];
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.filePreview = e.target?.result as string;
    };
    reader.readAsDataURL(this.selectedFile);
  }
}
    
}
      

    

  
  

  


