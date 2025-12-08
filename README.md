"# 🏠 Khotwa ila al-Mazil - Return to Home

**Plateforme de Réunification des Personnes Disparues et Retrouvées**

## 📋 Description

Khotwa ila al-Mazil est une plateforme web moderne qui facilite la réunification des personnes disparues et retrouvées. Elle permet aux citoyens de signaler les disparitions, de partager des informations sur les personnes retrouvées, et aide les autorités à coordonner les efforts de recherche.

### Objectifs
- ✅ Signaler les personnes disparues avec photos
- ✅ Signaler les personnes retrouvées
- ✅ Système d'approbation par les administrateurs
- ✅ Authentification sécurisée via OAuth2 Google
- ✅ Gestion des rôles (User, Admin, Moderator)
- ✅ Interface utilisateur intuitive et responsive

---

## 🛠️ Stack Technologique

### Backend
- **Framework:** Spring Boot 3.2.3
- **Base de données:** PostgreSQL 15+
- **ORM:** Hibernate + Spring Data JPA
- **Sécurité:** Spring Security (OAuth2 + Session)
- **Build:** Maven 3.8+
- **Java:** JDK 17+

### Frontend
- **Framework:** Angular 19.2
- **Styling:** Material Design
- **HTTP Client:** HttpClientModule
- **State Management:** RxJS
- **TypeScript:** 5+

---

## 🚀 Installation et Configuration

### Prérequis
- JDK 17 ou supérieur
- Node.js 18+ et npm
- PostgreSQL 15+
- Git

### Backend Setup

1. **Clone le repository:**
```bash
git clone https://github.com/Usermer/khotwa-ila-al-mazil.git
cd khotwa-ila-al-mazil/backend/projet
```

2. **Configure la base de données:**
```bash
# Crée la base de données PostgreSQL
createdb khotwa_db
```

3. **Configure `application.properties`:**
```properties
# Base de données
spring.datasource.url=jdbc:postgresql://localhost:5432/khotwa_db
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update

# OAuth2 Google
spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_CLIENT_SECRET
spring.security.oauth2.client.registration.google.redirect-uri=http://localhost:8080/login/oauth2/code/google

# Server
server.port=8080
```

4. **Build et Run:**
```bash
mvn clean install
mvn spring-boot:run
```

Backend: `http://localhost:8080`

---

### Frontend Setup

1. **Entre dans le dossier frontend:**
```bash
cd ../../frontend
```

2. **Installe les dépendances:**
```bash
npm install
```

3. **Run le serveur Angular:**
```bash
ng serve
```

Frontend: `http://localhost:4200`

---

## 🔐 Authentification

### OAuth2 Google
1. Crée une application sur Google Cloud Console
2. Configure les credentials OAuth2
3. Ajoute les URLs autorisées:
   - Redirect URI: `http://localhost:8080/login/oauth2/code/google`
   - Origins CORS: `http://localhost:4200`

### Login Classique
- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Se connecter

---

## 🔗 API Endpoints Principaux

### Authentification (`/api/auth`)
```
POST   /api/auth/register              - Créer compte
POST   /api/auth/login                 - Se connecter
GET    /api/auth/current-user          - Utilisateur actuel
POST   /api/auth/logout                - Se déconnecter
```

### Missing Persons (`/api/missing-persons`)
```
GET    /api/missing-persons/{id}       - Voir détails (approuvé)
GET    /api/missing-persons/approved   - Lister approuvés
POST   /api/missing-persons            - Créer signalement
POST   /api/missing-persons/with-photo - Créer avec photo
GET    /api/missing-persons/my-reports - Mes signalements
```

### Found Persons (`/api/found-persons`)
```
GET    /api/found-persons              - Lister tous
GET    /api/found-persons/{id}         - Voir détails
POST   /api/found-persons              - Créer signalement
POST   /api/found-persons/with-photo   - Créer avec photo
```

### Admin (`/api/admin/missing-persons`)
```
GET    /api/admin/missing-persons/pending
GET    /api/admin/missing-persons/approved
GET    /api/admin/missing-persons/rejected
PUT    /api/admin/missing-persons/{id}/approve
PUT    /api/admin/missing-persons/{id}/reject
```

---

## 🔒 Sécurité

- **Authentification:** OAuth2 Google + Email/Password
- **Encryption:** BCrypt pour les mots de passe
- **Session:** HTTP Session (30 min timeout)
- **CORS:** Configuré pour localhost:4200
- **CSRF:** Désactivé (OAuth2 + SPA)
- **Rôles:** ROLE_USER, ROLE_ADMIN, ROLE_MODERATOR

---

## 🚀 Git - Comment Pusher le Projet

### 1️⃣ **Initialiser le repository (si pas déjà fait)**

```bash
cd /chemin/vers/projetspring
git init
git remote add origin https://github.com/Usermer/khotwa-ila-al-mazil.git
```

### 2️⃣ **Configurer Git**

```bash
git config user.name "Ton Nom"
git config user.email "ton.email@example.com"

# Global (optionnel)
git config --global user.name "Ton Nom"
git config --global user.email "ton.email@example.com"
```

### 3️⃣ **Ajouter les fichiers**

```bash
# Tous les fichiers (en respectant .gitignore)
git add .

# Ou fichiers spécifiques
git add README.md .gitignore backend/ frontend/
```

### 4️⃣ **Vérifier les fichiers à commiter**

```bash
git status
```

### 5️⃣ **Faire un commit**

```bash
git commit -m "Initial commit: Khotwa ila al-Mazil project"

# Ou avec description plus détaillée
git commit -m "feat: Initialize project structure

- Add Spring Boot backend with OAuth2 Google authentication
- Add Angular frontend with Material Design
- Configure PostgreSQL database
- Setup security and CORS
- Add missing-persons and found-persons modules"
```

### 6️⃣ **Pusher vers GitHub**

```bash
# Première fois (établir la branche par défaut)
git push -u origin main

# Ensuite (simple)
git push
```

---

## 📝 Workflow Git Standard

### Créer une branche pour une feature
```bash
git checkout -b feature/oauth2-login
# Travaille sur ta feature...
git add .
git commit -m "feat: add OAuth2 Google login"
git push origin feature/oauth2-login
```

### Créer une Pull Request
1. Va sur GitHub
2. Clique "Compare & pull request"
3. Ajoute une description
4. Clique "Create Pull Request"

### Merger une Pull Request
```bash
# Retour sur main
git checkout main
git pull origin main

# Merger la branche
git merge feature/oauth2-login

# Pusher
git push origin main
```

---

## 📊 Commits Standards

```bash
# Feature
git commit -m "feat: add user authentication"

# Fix
git commit -m "fix: correct session persistence issue"

# Refactor
git commit -m "refactor: clean up OAuth2Controller"

# Documentation
git commit -m "docs: update README with setup instructions"

# Test
git commit -m "test: add unit tests for AuthService"

# Style
git commit -m "style: format code with Prettier"

# Chore
git commit -m "chore: update dependencies"
```

---

## 🏷️ Tags pour Releases

```bash
# Créer un tag
git tag -a v1.0.0 -m "First release - Initial setup"

# Pusher les tags
git push origin v1.0.0

# Voir tous les tags
git tag -l

# Supprimer un tag
git tag -d v1.0.0
```

---

## 🔄 Synchroniser avec le Repository

```bash
# Récupérer les changements distants
git fetch origin

# Fusionner avec ta branche locale
git merge origin/main

# Ou directement (fetch + merge)
git pull origin main
```

---

## 🐛 Troubleshooting Git

### Erreur: "fatal: not a git repository"
```bash
git init
git remote add origin https://github.com/Usermer/khotwa-ila-al-mazil.git
```

### Erreur: "failed to push some refs"
```bash
# Récupère les changements distants d'abord
git pull origin main

# Puis pousse
git push origin main
```

### Annuler le dernier commit (avant push)
```bash
git reset --soft HEAD~1
```

### Voir l'historique
```bash
git log --oneline -10
```

---

## 📄 License

Ce projet est sous licence MIT.

---

## 🤝 Contribution

1. Fork le repository
2. Crée une branche: `git checkout -b feature/YourFeature`
3. Commite tes changements: `git commit -m 'Add YourFeature'`
4. Pousse: `git push origin feature/YourFeature`
5. Ouvre une Pull Request

---

## 👥 Auteurs

- **Meryem Kada** - Développement Full Stack

---

**Dernière mise à jour:** 8 Décembre 2025" 
