import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { erreursDesChamps, messageErreur } from '../../utils/erreur';

function motsDePasseIdentiques(groupe: AbstractControl): ValidationErrors | null {
  const motDePasse = groupe.get('motDePasse')?.value;
  const confirmation = groupe.get('confirmation')?.value;
  return motDePasse === confirmation ? null : { differents: true };
}

@Component({
  selector: 'app-inscription',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './inscription.html',
})
export class Inscription {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected retour = this.route.snapshot.queryParamMap.get('retour') ?? '/';

  envoi = signal(false);
  erreur = signal<string | null>(null);
  erreursServeur = signal<Record<string, string>>({});
  motDePasseVisible = signal(false);

  formulaire = inject(FormBuilder).nonNullable.group(
    {
      nom: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
      confirmation: ['', Validators.required],
    },
    { validators: motsDePasseIdentiques },
  );

  invalide(champ: 'nom' | 'email' | 'motDePasse' | 'confirmation'): boolean {
    const controle = this.formulaire.controls[champ];
    return controle.touched && controle.invalid;
  }

  basculerMotDePasse(): void {
    this.motDePasseVisible.update((visible) => !visible);
  }

  inscrire(): void {
    if (this.formulaire.invalid) {
      this.formulaire.markAllAsTouched();
      return;
    }
    const { nom, email, motDePasse } = this.formulaire.getRawValue();
    this.envoi.set(true);
    this.erreur.set(null);
    this.erreursServeur.set({});
    this.auth.inscription(nom, email, motDePasse).subscribe({
      next: () => this.router.navigateByUrl(this.retour),
      error: (err) => {
        this.erreur.set(messageErreur(err, 'Inscription impossible'));
        this.erreursServeur.set(erreursDesChamps(err));
        this.envoi.set(false);
      },
    });
  }
}
