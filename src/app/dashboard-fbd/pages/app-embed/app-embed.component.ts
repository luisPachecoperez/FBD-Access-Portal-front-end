import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';
import { FontNavbarComponent } from "../../components/font-navbar/font-navbar-component";
import { MenuService } from '../../service/menu.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { AuthService } from '../../../auth/service/auth.service';

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
  private menuService = inject(MenuService);
  private authService = inject(AuthService);

  menuResource = rxResource({
    loader: () => {
      return this.menuService.getMenu().pipe(
        map(res => res.data?.getMenu ?? [])
      );
    },
    defaultValue: []
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.appUrl = params['url'] || '';
    });
  }
  logout() {
    // Clear all cookies
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.trim().split('=');
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}; secure; samesite=strict`;
    });

    // Specifically clear session_auth cookie in case it's set with different path/domain
    document.cookie = 'session_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + '; secure; samesite=strict';

    // Clear localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();

    // Call the auth service logout
    this.authService.logout();
  }
}
