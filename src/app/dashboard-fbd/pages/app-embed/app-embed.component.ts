import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';
import { FontNavbarComponent } from '../../components/font-navbar/font-navbar-component';
import {
  MenuService,
  GetMenuResponse,
  MenuItem,
} from '../../service/menu.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { AuthService } from '../../../auth/service/auth.service';
import { CookieParts } from './cookie-parts.interface';

// Utilidad para desglosar una cookie en nombre y valor de forma segura
function parseCookie(cookie: string): CookieParts {
  const [name, ...rest] = cookie.trim().split('=');
  return {
    name: name ?? '',
    value: rest.join('=') ?? '',
  };
}

@Component({
  selector: 'app-embed',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe, FontNavbarComponent],
  templateUrl: './app-embed.component.html',
  styleUrls: ['./app-embed.component.css'],
})
export class AppEmbedComponent implements OnInit {
  appUrl: string = '';

  constructor(private route: ActivatedRoute) {}
  private menuService = inject(MenuService);
  private authService = inject(AuthService);

  menuResource = rxResource<MenuItem[], unknown>({
  stream: () => this.menuService
    .getMenu()
    .pipe(map((res: GetMenuResponse) => res.data?.getMenu ?? [])),
  defaultValue: [],
});

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((paramMap) => {
      this.appUrl = paramMap.get('url') ?? '';
    });
  }
  logout() {
    // Clear all cookies
    document.cookie.split(';').forEach((cookie) => {
      const parsed: CookieParts = parseCookie(cookie);
      if (parsed.name) {
        document.cookie = `${parsed.name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}; secure; samesite=strict`;
      }
    });

    // Specifically clear session_auth cookie in case it's set with different path/domain
    document.cookie =
      'session_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' +
      window.location.hostname +
      '; secure; samesite=strict';

    // Clear localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();

    // Call the auth service logout
    this.authService.logout();
  }
}
