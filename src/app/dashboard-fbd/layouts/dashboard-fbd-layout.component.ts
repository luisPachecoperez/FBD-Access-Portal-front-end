import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontNavbarComponent } from "../components/font-navbar/font-navbar-component";

@Component({
  selector: 'app-dashboard-fbd-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FontNavbarComponent
],
  templateUrl: './dashboard-fbd-layout.component.html',
  styleUrls: ['./dashboard-fbd-layout.component.css']
})
export class DashboardFbdLayoutComponent { }
