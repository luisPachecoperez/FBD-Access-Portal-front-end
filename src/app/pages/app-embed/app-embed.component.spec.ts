import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppEmbedComponent } from './app-embed.component';

describe('AppEmbedComponent', () => {
  let component: AppEmbedComponent;
  let fixture: ComponentFixture<AppEmbedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppEmbedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppEmbedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
