import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { messageErreur } from '../../utils/erreur';

@Component({
  selector: 'app-connexion',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './connexion.html',
})
export class Connexion {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected retour = this.route.snapshot.queryParamMap.get('retour') ?? '/';
  protected sessionExpiree = this.route.snapshot.queryParamMap.has('expire');

  envoi = signal(false);
  erreur = signal<string | null>(null);
  motDePasseVisible = signal(false);

  formulaire = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', Validators.required],
  });

  basculerMotDePasse(): void {
    this.motDePasseVisible.update((visible) => !visible);
  }

  connecter(): void {
    if (this.formulaire.invalid) {
      this.formulaire.markAllAsTouched();
      return;
    }
    const { email, motDePasse } = this.formulaire.getRawValue();
    this.envoi.set(true);
    this.erreur.set(null);
    this.auth.connexion(email, motDePasse).subscribe({
      next: (reponse) => {
        const destination =
          this.retour === '/' && reponse.utilisateur.role === 'ADMIN' ? '/admin' : this.retour;
        this.router.navigateByUrl(destination);
      },
      error: (err) => {
        this.erreur.set(messageErreur(err, 'Connexion impossible'));
        this.envoi.set(false);
      },
    });
  }
}
