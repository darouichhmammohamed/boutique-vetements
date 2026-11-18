# 👕 Boutique de vêtements – Angular + Spring Boot

Application e-commerce full stack réalisée dans le cadre d'un projet étudiant :
catalogue d'articles Nike, panier, commandes, comptes clients et espace d'administration.

## Fonctionnalités

**Client**
- Catalogue avec filtre par catégorie (Homme, Femme, Enfant), recherche et tri par prix ou par nom
- Fiche produit : choix de la taille et de la quantité, stock affiché
- Panier sauvegardé dans le navigateur (il reste après un rechargement)
- Création de compte, connexion et déconnexion (jeton JWT)
- Passage de commande avec adresse de livraison, puis suivi et annulation dans « Mes commandes »

**Administrateur**
- Gestion des produits : liste, ajout, modification, suppression, aperçu de l'image
- Gestion des catégories : ajout, renommage, suppression
- Gestion des commandes : changement de statut et statistiques (nombre, en attente, chiffre d'affaires)

**Règles métier côté serveur**
- Validation de toutes les données reçues (messages d'erreur par champ)
- Vérification de la taille et du stock à la commande, puis mise à jour du stock
- Remise en stock quand une commande est annulée
- Routes protégées par rôle : `CLIENT` ou `ADMIN`

## Technologies

| Partie | Technologies |
|---|---|
| Frontend | Angular 22 (composants standalone, signals), Bootstrap 5.3, RxJS |
| Backend | Spring Boot 4.1, Spring Web, Spring Data JPA (Hibernate), Spring Security, OAuth2 Resource Server (JWT), Bean Validation, Lombok |
| Base de données | MySQL |
| Outils | Maven Wrapper, Angular CLI, Bruno (tests de l'API), Vitest |

## Architecture

```
boutique-vetements/
├── backend/                       API REST Spring Boot (port 8080)
│   └── src/main/java/com/boutique/backend/
│       ├── entity/                Tables : Produit, Categorie, Utilisateur, Commande, LigneCommande
│       ├── repository/            Accès à la base (Spring Data JPA)
│       ├── service/               Règles métier
│       ├── controller/            Routes REST
│       ├── dto/                   Objets reçus / renvoyés par l'API
│       ├── security/              Spring Security + JWT
│       ├── exception/             Gestion centralisée des erreurs
│       └── config/                Données de départ (catégories, admin, articles Nike)
└── frontend/                      Application Angular (port 4200)
    └── src/app/
        ├── components/            Pages : catalogue, détail, panier, connexion, commandes, admin
        ├── services/              Appels HTTP, panier, authentification
        ├── models/                Interfaces TypeScript
        ├── guards/                Protection des pages (connecté / admin)
        ├── interceptors/          Ajout automatique du jeton JWT
        └── utils/                 Messages d'erreur et libellés de statut
```

## Installation

### Prérequis
- Java 21 ou plus (testé avec Java 25)
- Node.js 20 ou plus et Angular CLI (`npm install -g @angular/cli`)
- MySQL 8 ou plus, lancé sur le port 3306

### 1. Configurer les secrets du backend
Copier le fichier d'exemple :
```bash
cd backend/src/main/resources
cp application-secret.properties.example application-secret.properties
```
Puis remplir dans `application-secret.properties` :
- `spring.datasource.password` : le mot de passe de l'utilisateur `root` de MySQL
- `app.jwt.secret` : une clé aléatoire en Base64 d'au moins 32 octets, par exemple générée avec `openssl rand -base64 48`

Ce fichier est ignoré par Git : les mots de passe ne sont jamais publiés.

### 2. Lancer le backend
```bash
cd backend
./mvnw spring-boot:run
```
Au premier démarrage, l'application crée automatiquement la base `boutique_db`, les tables,
les catégories, les articles Nike et le compte administrateur.

### 3. Lancer le frontend
```bash
cd frontend
npm install
ng serve
```
Le site est alors disponible sur http://localhost:4200

## Comptes de démonstration

| Rôle | Email | Mot de passe |
|---|---|---|
| Administrateur | admin@boutique.com | Admin123! |
| Client | à créer depuis la page « Créer un compte » | |

Le mot de passe administrateur peut être changé avec la variable d'environnement `ADMIN_PASSWORD`
avant le premier démarrage.

## API REST

| Méthode | Route | Accès |
|---|---|---|
| GET | `/api/produits`, `/api/produits/{id}`, `/api/produits/categorie/{id}`, `/api/produits/recherche?q=` | Public |
| GET | `/api/categories`, `/api/categories/{id}` | Public |
| POST | `/api/auth/inscription`, `/api/auth/connexion` | Public |
| GET | `/api/auth/moi` | Connecté |
| POST | `/api/commandes` | Connecté |
| GET | `/api/commandes/mes-commandes` | Connecté |
| PUT | `/api/commandes/{id}/annuler` | Connecté (sa propre commande) |
| POST, PUT, DELETE | `/api/produits/**`, `/api/categories/**` | Admin |
| GET | `/api/commandes` | Admin |
| PUT | `/api/commandes/{id}/statut` | Admin |

Les erreurs sont renvoyées au format JSON : `{ "status": 404, "message": "...", "date": "..." }`.
Les erreurs de validation ajoutent un objet `erreurs` qui donne un message par champ.

## Tests

```bash
cd frontend
ng test
```

## Crédits

Projet pédagogique sans but commercial. Les noms des articles et les images appartiennent à Nike, Inc.
Les images sont chargées directement depuis le site de Nike.
