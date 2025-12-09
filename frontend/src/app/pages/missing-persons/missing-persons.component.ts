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
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { MissingService } from '../../services/missing.service';

@Component({
  selector: 'app-missing-persons',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatButtonModule, MatIconModule, MatInputModule,
    MatFormFieldModule, MatSelectModule, MatChipsModule,
    MatProgressSpinnerModule, MatPaginatorModule, MatMenuModule, MatDividerModule
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

// Méthodes de partage social
sharePerson(person: any): void {
  const message = `Help find ${person.firstname} ${person.lastname}! Missing since ${person.lastSeenDate} from ${person.lastSeenLocation}. If you have information, please contact: ${person.contactNumber}`;
  const personUrl = `${window.location.origin}/missing/${person.id}`;
  
  this.shareOnFacebook(personUrl);
}

shareOnFacebook(url: string): void {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(facebookUrl, '_blank', 'width=600,height=400');
}

shareOnTwitter(person: any): void {
  const message = `Help find ${person.firstname} ${person.lastname}! Missing since ${person.lastSeenDate} from ${person.lastSeenLocation}`;
  const url = `${window.location.origin}/missing/${person.id}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`;
  window.open(twitterUrl, '_blank', 'width=600,height=400');
}

shareOnWhatsApp(person: any): void {
  const message = `Help find ${person.firstname} ${person.lastname}! Missing since ${person.lastSeenDate} from ${person.lastSeenLocation}. Contact: ${person.contactNumber}. More info: ${window.location.origin}/missing/${person.id}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}

shareOnLinkedIn(person: any): void {
  const url = `${window.location.origin}/missing/${person.id}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  window.open(linkedinUrl, '_blank', 'width=600,height=400');
}

shareViaEmail(person: any): void {
  const subject = `Help find ${person.firstname} ${person.lastname}`;
  const body = `Help us find ${person.firstname} ${person.lastname}!\n\nMissing since: ${person.lastSeenDate}\nLast seen: ${person.lastSeenLocation}\nContact: ${person.contactNumber}\n\nMore information: ${window.location.origin}/missing/${person.id}\n\nPlease share this information if you have any details.`;
  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
}
//etape1:upload de l'image
//on l'envoie au backend
//(service)sauvegarde dans le dossier local
//(controller)stocke dans la base de donnees
//frontend:recupere l'image du backend
//transforme l'utl (localhost:8080/api/files/download/missing-persons/nomdufichier)
//affiche l'image dans le componentWorking