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
import { MissingService } from '../../services/missing.service';

@Component({
  selector: 'app-missing-persons',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatButtonModule, MatIconModule, MatInputModule,
    MatFormFieldModule, MatSelectModule, MatChipsModule,
    MatProgressSpinnerModule, MatPaginatorModule
  ],
  templateUrl: './missing-persons.component.html',
  styleUrl: './missing-persons.component.css'
})
export class MissingPersonsComponent implements OnInit {
  missingPersons: any[] = [];
  filteredPersons: any[] = [];
  isLoading = true;
  errorMessage = '';
  
  searchQuery = '';
  selectedStatus = 'APPROVED';
  selectedGender = '';
  
  // Pagination
  pageIndex = 0;
  pageSize = 9;
  totalItems = 0;

  genderOptions = ['Male', 'Female'];
  statusOptions = ['APPROVED', 'PENDING', 'REJECTED'];

  constructor(private missingService: MissingService) {}

  ngOnInit(): void {
    this.loadMissingPersons();
  }

  loadMissingPersons(): void {
    this.isLoading = true;
    this.errorMessage = '';
    console.log(' Loading missing persons...');
    
    // Pour commencer, charger tous les rapports approuvés
    this.missingService.getApprovedReports().subscribe({
      next: (data) => {
        console.log(' Missing persons loaded:', data);
        this.missingPersons = data || [];
        this.totalItems = this.missingPersons.length;
        console.log(' Total missing persons:', this.totalItems);
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error loading missing persons reports';
        console.error(' Error loading missing persons:', error);
      }
    });
  }

  applyFilters(): void {
    //filteredPersons =[] c'est une liste
    this.filteredPersons = this.missingPersons.filter(person => {
      const matchesSearch = !this.searchQuery //si la barre de recherche est vide retourne true
       || 
       //si le prenom ou nom ou description contient une partie de ce qu'on a chercher
        person.firstname.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        person.lastname.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        person.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      //si aucun genre n'est selectionne retourne true
      //sinon verifie si le genre de la personne correspond au genre selectionne
      //si oui on retoune true
      const matchesGender = !this.selectedGender || person.gender === this.selectedGender;
      
      //true si les deux conditions sont vraies
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
    return 'Older Adult';
  }

  getDaysAgo(date: any): string {
    //si on n'a pas de date on retourne inconnu
    if (!date) return 'Unknown';
    const dateObj = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - dateObj.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days ago`;
  }
  //methode pour obtenir l'url de l'image
 getImageUrl(photoUrl: string): string {
  if (!photoUrl) return '';
  
  // Extraire juste le nom du fichier de l'URL
  const filename = photoUrl.split('/').pop(); 
  //on divise la chaine a chaque '/' et on prend la derniere partie
  //qui est equivalente au nom du fichier
  
  return `http://localhost:8080/api/files/download/missing-persons/${filename}`;
}
  onImageLoad(person: any): void {
  console.log('Image loaded successfully for:', person.firstname);
}

onImageError(person: any): void {
  console.error(' Image failed to load for:', person.firstname);
  console.error('Tried URL:', this.getImageUrl(person.photoUrl));
}
}
//etape1:upload de l'image
//on l'envoie au backend
//(service)sauvegarde dans le dossier local
//(controller)stocke dans la base de donnees
//frontend:recupere l'image du backend
//transforme l'utl (localhost:8080/api/files/download/missing-persons/nomdufichier)
//affiche l'image dans le component