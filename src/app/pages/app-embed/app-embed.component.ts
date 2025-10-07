import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from '../../dashboard-fbd/pipes/safe-url.pipe';

@Component({
  selector: 'app-embed',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe],
  templateUrl: './app-embed.component.html',
  styleUrls: ['./app-embed.component.css'],
})
export class AppEmbedComponent implements OnInit {
  appUrl: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.appUrl = typeof params['url'] === 'string' ? params['url'] : '';
      console.log('URL cargada:', this.appUrl); // Para depuración
    });
  }
}
