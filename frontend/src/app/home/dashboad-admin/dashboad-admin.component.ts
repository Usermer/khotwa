import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Material Modules
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { MissingService } from '../../services/missing.service';
import { FoundService } from '../../services/found.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-dashboad-admin',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatTabsModule, MatCardModule, MatButtonModule, MatIconModule,
    MatBadgeModule, MatChipsModule, MatProgressSpinnerModule,
    MatPaginatorModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatSelectModule
  ],
  templateUrl: './dashboad-admin.component.html',
  styleUrl: './dashboad-admin.component.css'
})
export class DashboadAdminComponent implements OnInit {
  // Tabs
  selectedTab = 0;

  // Missing Persons Data
  pendingMissing: any[] = [];
  approvedMissing: any[] = [];
  rejectedMissing: any[] = [];
  filteredMissing: any[] = [];
  missingLoading = false;
  missingPageIndex = 0;
  missingPageSize = 5;

  // Found Persons Data
  foundPersons: any[] = [];
  filteredFound: any[] = [];
  foundLoading = false;
  foundPageIndex = 0;
  foundPageSize = 5;

  // Matches Data
  matches: any[] = [];

  // Search/Filter
  searchQuery = '';
  selectedStatus = 'PENDING';

  statusBadgeColors: { [key: string]: string } = {
    PENDING: 'warn',
    APPROVED: 'accent',
    REJECTED: 'primary',
    IDENTIFIED: 'accent',
    UNIDENTIFIED: 'warn',
    REUNITED: 'primary',
    CLOSED: 'primary'
  };

  constructor(
    private missingService: MissingService,
    private foundService: FoundService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loadMissingPersons();
    this.loadFoundPersons();
  }

  // ==================== MISSING PERSONS ====================

  loadMissingPersons(): void {
    this.missingLoading = true;
    console.log('📋 Loading missing persons for admin...');

    this.adminService.getPending().subscribe({
      next: (data) => {
        console.log('✅ Pending missing persons:', data);
        this.pendingMissing = data || [];
        this.applyMissingFilter();
        this.missingLoading = false;
      },
      error: (error) => {
        this.missingLoading = false;
        console.error('❌ Error loading pending missing:', error);
        this.pendingMissing = [];
        this.applyMissingFilter();
      }
    });

    this.adminService.getApproved().subscribe({
      next: (data) => {
        this.approvedMissing = data || [];
      },
      error: () => {
        this.approvedMissing = [];
      }
    });

    this.adminService.getRejected().subscribe({
      next: (data) => {
        this.rejectedMissing = data || [];
      },
      error: () => {
        this.rejectedMissing = [];
      }
    });
  }

  applyMissingFilter(): void {
    if (this.selectedStatus === 'PENDING') {
      this.filteredMissing = this.pendingMissing;
    } else if (this.selectedStatus === 'APPROVED') {
      this.filteredMissing = this.approvedMissing;
    } else if (this.selectedStatus === 'REJECTED') {
      this.filteredMissing = this.rejectedMissing;
    }

    this.filteredMissing = this.filteredMissing.filter(person =>
      person.firstname.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      person.lastname.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.missingPageIndex = 0;
  }

  get paginatedMissing(): any[] {
    const startIndex = this.missingPageIndex * this.missingPageSize;
    return this.filteredMissing.slice(startIndex, startIndex + this.missingPageSize);
  }

  onMissingPageChange(event: PageEvent): void {
    this.missingPageIndex = event.pageIndex;
    this.missingPageSize = event.pageSize;
  }

  approveMissing(id: number): void {
    console.log('✅ Approving missing person:', id);
    this.adminService.approveRequest(id).subscribe({
      next: () => {
        console.log('✅ Missing person approved');
        this.loadMissingPersons();
      },
      error: (error) => {
        console.error('❌ Error approving:', error);
      }
    });
  }

  rejectMissing(id: number): void {
    const reason = prompt('Reason for rejection:');
    if (reason) {
      console.log('❌ Rejecting missing person:', id);
      this.adminService.rejectRequest(id, reason).subscribe({
        next: () => {
          console.log('✅ Missing person rejected');
          this.loadMissingPersons();
        },
        error: (error) => {
          console.error('❌ Error rejecting:', error);
        }
      });
    }
  }

  // ==================== FOUND PERSONS ====================

  loadFoundPersons(): void {
    this.foundLoading = true;
    console.log('📋 Loading found persons...');

    this.foundService.getAllReports().subscribe({
      next: (data) => {
        console.log('✅ Found persons loaded:', data);
        this.foundPersons = data || [];
        this.applyFoundFilter();
        this.foundLoading = false;
      },
      error: (error) => {
        this.foundLoading = false;
        console.error('❌ Error loading found persons:', error);
        this.foundPersons = [];
        this.applyFoundFilter();
      }
    });
  }

  applyFoundFilter(): void {
    this.filteredFound = this.foundPersons.filter(person =>
      person.firstname.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      person.lastname.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.foundPageIndex = 0;
  }

  get paginatedFound(): any[] {
    const startIndex = this.foundPageIndex * this.foundPageSize;
    return this.filteredFound.slice(startIndex, startIndex + this.foundPageSize);
  }

  onFoundPageChange(event: PageEvent): void {
    this.foundPageIndex = event.pageIndex;
    this.foundPageSize = event.pageSize;
  }

  // ==================== MATCHES ====================

  loadMatches(): void {
    // TODO: Implement face matching
    console.log('🔄 Loading matches...');
    this.matches = [];
  }

  // ==================== HELPERS ====================

  getStatusColor(status: string): string {
    return this.statusBadgeColors[status] || 'primary';
  }

  getDaysAgo(date: any): string {
    if (!date) return 'Unknown';
    const dateObj = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - dateObj.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days ago`;
  }

  onSearchChange(): void {
    this.applyMissingFilter();
    this.applyFoundFilter();
  }

  onStatusChange(): void {
    this.applyMissingFilter();
  }

  onImageError(event: any): void {
    console.error('❌ Image failed to load:', event.src);
    event.target.src = '';
    event.target.style.display = 'none';
  }
}
