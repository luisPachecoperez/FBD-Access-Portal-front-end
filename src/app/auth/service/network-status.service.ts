// network-status.service.ts
import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { BehaviorSubject, fromEvent, merge, Subscription, interval, of } from 'rxjs';
import { map, startWith, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NetworkStatusService implements OnDestroy {
  private subs: Subscription[] = [];
  /** Online real del navegador */
  public onlineStatus$ = new BehaviorSubject<boolean>(navigator.onLine);
 // public onlineStatus$ = new BehaviorSubject<boolean>(false);

  constructor(private ngZone: NgZone) {
    this.listenNavigatorOnlineOffline();
    // (Opcional) verificación activa para “internet real”, no solo red local
    this.heartbeatCheck();
  }

  /** Escucha eventos del navegador */
  private listenNavigatorOnlineOffline(): void {
    const online$  = fromEvent(window, 'online').pipe(map(() => true));
    const offline$ = fromEvent(window, 'offline').pipe(map(() => false));

    const connection$ = merge(online$, offline$).pipe(
      //startWith(navigator.onLine),
      startWith(navigator.onLine),
      distinctUntilChanged()
    );

    this.subs.push(
      connection$.subscribe((status) => {
        // Asegura cambio dentro de Angular
        this.ngZone.run(() => this.onlineStatus$.next(status));
      })
    );
  }

  /** Ping simple (opcional) para detectar desconexión aunque navigator.onLine sea true */
  private heartbeatCheck(): void {
    const checker$ = interval(10000).pipe( // cada 10s
      startWith(0),
      switchMap(() =>
        fetch('https://www.gstatic.com/generate_204', { cache: 'no-store', mode: 'no-cors' })
          .then(() => true)
          .catch(() => false)
      ),
      // 🔎 Log en cada tick
      tap(reachable => console.log('heartbeat', new Date().toISOString(), 'reachable:', reachable)),
      // Emite a la UI solo cuando CAMBIA el estado
      distinctUntilChanged()
    );
  
    this.subs.push(
      checker$.subscribe(reachable => {
        if (this.onlineStatus$.value !== reachable) {
          this.ngZone.run(() => this.onlineStatus$.next(reachable));
        }
      })
    );
  }
  

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }
}
