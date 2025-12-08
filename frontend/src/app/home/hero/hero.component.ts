import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-hero',
  imports: [RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  reportMenuOpen = false;
  
  navItems = [
    { label: 'Home', path: '/' },
    { label: 'Missing Persons', path: '/missing' },
    { label: 'Found Persons', path: '/found' },
    { label: 'Report', path: '/report', hasSubmenu: true },
    { label: 'Map', path: '/map' },
    { label: 'Login', path: '/login' }
  ];

  reportSubmenu = [
    { label: 'Report Missing', path: '/report/missing' },
    { label: 'Report Found', path: '/report/found' }
  ];

  toggleReportMenu() {
    this.reportMenuOpen = !this.reportMenuOpen;
  }

  closeReportMenu() {
    this.reportMenuOpen = false;
  }
}
