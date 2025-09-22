import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';
import { FontNavbarComponent } from "../../components/font-navbar/font-navbar-component";

@Component({
  selector: 'app-embed',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe, FontNavbarComponent],
  templateUrl: './app-embed.component.html',
  styleUrls: ['./app-embed.component.css']
})
export class AppEmbedComponent implements OnInit {
  appUrl: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.appUrl = params['url'] || '';
    });
  }
}
