import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'font-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './font-navbar-component.html',
  styleUrls: ['./font-navbar-component.css']
})
export class FontNavbarComponent {
  logout() {
    console.log('Cerrar sesión');
  }
}
