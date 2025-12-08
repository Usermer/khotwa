import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FoundService } from '../../services/found.service';  
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-found-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, 
    MatInputModule,  MatSelectModule, MatButtonModule, MatIconModule, MatDatepickerModule, MatNativeDateModule, MatTooltipModule],
  templateUrl: './found-form.component.html',
  styleUrl: './found-form.component.css'
})
export class FoundFormComponent implements OnInit {
  foundForm!: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  selectedFile: File | null = null;
  filePreview: string | null = null;

  genderOptions = ['MALE', 'FEMALE'];


  constructor(
    private fb: FormBuilder,
    private foundService: FoundService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.foundForm = this.fb.group({
      // Personal Information
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.min(0), Validators.max(150)]],
      gender: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      photoUrl: [''],

      // Found Information
      foundDate: ['', [Validators.required]],
      foundLocation: ['', [Validators.required]],
      

      // Contact Information
      contactName: ['', [Validators.required]],
      contactNumber: ['', [Validators.required]],
      contactEmail: ['', [Validators.required, Validators.email]],
      
    });
  }

  onSubmit(): void {
    if (this.foundForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly';
      setTimeout(() => this.errorMessage = '', 5000);
      return;
    }

    if (!this.authService.isAuthenticated()) {
      this.errorMessage = 'You must be logged in to submit a report';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.selectedFile) {
      this.uploadWithPhoto();
    } else {
      this.foundService.createReport(this.foundForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Report created successfully! Redirecting...';
          this.foundForm.reset();
          setTimeout(() => {
            this.router.navigate(['/user-page']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          if (error.status === 401) {
            this.errorMessage = 'Session expired. Please login again';
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          } else {
            this.errorMessage = error.error?.error || 'Error submitting report. Please try again';
          }
          setTimeout(() => this.errorMessage = '', 5000);
        }
      });
    }
  }

  private uploadWithPhoto(): void {
    const formData = new FormData();
    const form = this.foundForm.value;
    
    // Add all form fields to FormData
    formData.append('firstname', form.firstname);
    formData.append('lastname', form.lastname);
    formData.append('age', form.age || '');
    formData.append('gender', form.gender);
    formData.append('dateFound', form.foundDate instanceof Date 
      ? form.foundDate.toISOString().split('T')[0]
      : form.foundDate);
    formData.append('locationFound', form.foundLocation);
    formData.append('description', form.description);
    formData.append('contactName', form.contactName || '');
    formData.append('contactEmail', form.contactEmail || '');
    formData.append('contactNumber', form.contactNumber || '');
    formData.append('file', this.selectedFile!);
    
    this.foundService.createReportWithPhoto(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Report created successfully with photo!';
        this.foundForm.reset();
        this.selectedFile = null;
        this.filePreview = null;
        setTimeout(() => {
          this.router.navigate(['/user-page']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 401) {
          this.errorMessage = 'Session expired. Please login again';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.errorMessage = error.error?.error || 'Error creating report. Please try again';
        }
        setTimeout(() => this.errorMessage = '', 5000);
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

  removePhoto(): void {
    this.selectedFile = null;
    this.filePreview = null;
  }
}
