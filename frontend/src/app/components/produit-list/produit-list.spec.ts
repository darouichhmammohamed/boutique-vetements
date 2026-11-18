import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ProduitList } from './produit-list';

describe('ProduitList', () => {
  let fixture: ComponentFixture<ProduitList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduitList],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ProduitList);
  });

  it('crée le composant', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('affiche le spinner pendant le chargement', () => {
    fixture.detectChanges();
    const page = fixture.nativeElement as HTMLElement;
    expect(page.querySelector('.spinner-border')).toBeTruthy();
  });
});
