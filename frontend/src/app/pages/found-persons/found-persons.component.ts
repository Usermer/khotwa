import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { FoundService } from '../../services/found.service';

@Component({
  selector: 'app-found-persons',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatButtonModule, MatIconModule, MatInputModule,
    MatFormFieldModule, MatSelectModule, MatChipsModule,
    MatProgressSpinnerModule, MatPaginatorModule
  ],
  templateUrl: './found-persons.component.html',
  styleUrl: './found-persons.component.css'
})
export class FoundPersonsComponent implements OnInit {
  foundPersons: any[] = [];
  filteredPersons: any[] = [];
  isLoading = true;
  errorMessage = '';
  
  searchQuery = '';
  selectedStatus = 'IDENTIFIED';
  selectedGender = '';
  
  // Pagination
  pageIndex = 0;
  pageSize = 9;
  totalItems = 0;

  genderOptions = ['Male', 'Female', 'Other', ''];
  statusOptions = ['IDENTIFIED', 'UNIDENTIFIED', 'REUNITED', 'CLOSED'];

  constructor(private foundService: FoundService) {}

  ngOnInit(): void {
    this.loadFoundPersons();
  }

  loadFoundPersons(): void {
    this.isLoading = true;
    this.errorMessage = '';
    console.log('📋 Loading found persons...');
    
    // Charger tous les rapports de personnes trouvées
    this.foundService.getAllReports().subscribe({
      next: (data) => {
        console.log('✅ Found persons loaded:', data);
        this.foundPersons = data || [];
        this.totalItems = this.foundPersons.length;
        console.log('📊 Total found persons:', this.totalItems);
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error loading found persons reports';
        console.error('❌ Error loading found persons:', error);
      }
    });
  }

  applyFilters(): void {
    this.filteredPersons = this.foundPersons.filter(person => {
      const matchesSearch = !this.searchQuery || 
        person.firstname.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        person.lastname.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        person.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesGender = !this.selectedGender || person.gender === this.selectedGender;
      
      return matchesSearch && matchesGender;
    });
  }

  onSearchChange(): void {
    this.pageIndex = 0;
    this.applyFilters();
  }

  onFilterChange(): void {
    this.pageIndex = 0;
    this.applyFilters();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  get paginatedPersons(): any[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredPersons.slice(startIndex, startIndex + this.pageSize);
  }

  getAgeRange(age: number): string {
    if (age < 10) return 'Child';
    if (age < 18) return 'Teen';
    if (age < 60) return 'Adult';
    return 'Senior';
  }

  getDaysAgo(date: any): string {
    if (!date) return 'Unknown';
    const dateObj = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - dateObj.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days ago`;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'IDENTIFIED': return 'accent';
      case 'REUNITED': return 'primary';
      case 'UNIDENTIFIED': return 'warn';
      case 'CLOSED': return 'default';
      default: return 'default';
    }
  }
}
