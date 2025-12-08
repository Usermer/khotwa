import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeroComponent } from "./home/hero/hero.component";
import { HeroSectionComponent } from './home/hero-section/hero-section.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { UserPageComponent } from './home/user-page/user-page.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeroComponent,HeroSectionComponent,LoginComponent,RegisterComponent,UserPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
