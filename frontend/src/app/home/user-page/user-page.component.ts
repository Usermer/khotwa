import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { HeroSectionComponent } from '../hero-section/hero-section.component';

@Component({
  selector: 'app-user-page',
  imports: [HeroComponent, HeroSectionComponent],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})
export class UserPageComponent {

}
