# Documentation Technique du Portfolio Angular

Cette documentation vise à expliquer l'architecture interne, le cycle de vie des composants et les choix techniques utilisés pour le développement du portfolio de **Diarrassouba**.

---

## 1. Vue d'Ensemble de l'Architecture

Le portfolio repose sur **Angular 21** et utilise la nouvelle API des `Standalone Components`. Il n'y a **aucun module (`NgModules`)** dans cette application, ce qui assure un couplage léger, un Lazy Loading natif (si besoin) et une clarté de code accrue.

L'application est structurée autour d'un système de **Single Page Application (SPA)**, avec un composant parent racine gérant la coque visuelle globale (Background, Curseur dynamique, Routage).

### Fichiers Clés à la Racine
- `angular.json` : Fichier de build. Utilise le *bundler* `esbuild` ultra-rapide par défaut.
- `tsconfig.json` & `tsconfig.app.json` : Config TypeScript. Optimisé avec `"module": "preserve"` et `"moduleResolution": "bundler"` pour un support ESNext sans faille.
- `src/main.ts` : Point d'amorçage exclusif Standalone (`bootstrapApplication`).

---

## 2. Dossiers et Composants (`src/app/components/`)

L'interface a été découpée de manière atomique en plusieurs composants métiers.

### A. `<app-home>` (Page Principale Composite)
Le composant `Home` ne possède pratiquement pas de logique propre. Son template importe et empile toutes les sections de présentation statique (`Hero`, `About`, `Skills`, `Projects`, `Contact`).
*Ce pattern permet de garder un composant `App` propre tout en facilitant l'accès aux autres pages autonomes sans réafficher tous les blocs métiers.*

### B. `<app-navbar>` (Barre de navigation temporelle)
- **Logique d'état** : Maintient la variable `isMenuOpen` pour le toggle du menu hamburger en mobile.
- **Dark Mode** : Utilise `localStorage` et le média CSS `(prefers-color-scheme: dark)` dans son constructeur pour appliquer dynamiquement la classe CSS `.dark` dès le lancement.
- **HostListener Scroll** : Écoute le défilement de l'utilisateur pour surligner automatiquement la section active dans le menu via le calcul d'offset natif (`section.offsetTop`).

### C. `<app-contact>` (Formulaires d'entrée)
- **Services API** : Au lieu d'un backend lourd, le formulaire est relié de manière asynchrone à [Formspree](https://formspree.io/).
- **Gestion des promesses** : Utilise `async/await` pour gérer le statut du formulaire (loading, succès, échec).
- **Clipboard** : Possède une fonction native de copie au presse-papier (`navigator.clipboard`) pour l'adresse mail.

### D. `<app-footer>` (Pied de page interactif)
- **Newsletter** : Exactement comme pour Contact, l'inscription est gérée via fetch vers Formspree. L'état (`idle`, `loading`, `success`) pilote dynamiquement le comportement de l'icône `FontAwesome`.
- **Bouton Scroll-to-Top** : Détecte l'offset Y via un HostListener isolé pour s'afficher uniquement après la ligne de flottaison (500px).

### E. `<app-cv>` (Page Curriculum Vitae)
- **Design Midnight Aurora** : Sidebar avec glassmorphism et timeline interactive.
- **Animations de Remplissage** : Les barres de progression des compétences s'animent de 0% à leur valeur cible (`data-width`) via un `IntersectionObserver` dédié dans `cv.ts`.
- **Routage et Isolation** : Accessible via `/cv`. Pour une immersion totale, la Navbar et le Footer globaux sont masqués dynamiquement sur cette route via une condition `@if` dans `app.html`.
- **Reveal on Scroll** : Réactivation des animations d'apparition qui étaient bridées par le CSS, offrant une lecture fluide et rythmée.

### F. Les Pages Légales (Désactivées)
- Anciennement `privacy-policy` & `terms`. Elles ont été retirées du routage actif pour simplifier la navigation SPA actuelle.

---

## 3. Logique Globale et UX Avancée (`src/app/app.ts`)

Pour ne pas alourdir chaque composant avec de l'animation, la **logique visuelle transversale est injectée globalement** (`ngAfterViewInit` du composant Root `<app-root>`). 

- **Custom Cursor & Mesh Gradient** :
  L'effet de curseur de bureau stylisé à points suivis est traqué via le cycle `requestAnimationFrame`. Son tracking de position absolue se met à jour en douceur `cx += (mx - cx) * 0.1` à l'écoute native de `window:mousemove`.

- **Scroll Reveal (Intersection Observer)** :
  L'API native Javascript `IntersectionObserver` scanne chaque objet ayant la classe `.reveal`. 
  C'est nettement plus performant qu'un écouteur classique. 
  *Seuil (`threshold`)*: Déclenche l'animation d'apparition quand l'élément entre à au moins 8% de sa hauteur dans l'écran.

- **Compteurs Animés (Counter Stats)** :
  Idem, un Observer cible spécifiquement la section Hero pour animer de `0` à `N` les statistiques du profil. L'intervalle dynamique varie intelligemment selon l'écart à atteindre (`cible / 40`).

---

## 4. Stratégie de Style et CSS

- CSS Vanille natif, sans surcouche complexe, permettant des *Custom Properties* (variables racine `--primary`, `--bg`, etc.).
- Le basculement thématique (Dark mode) effectue simplement un échange direct de la palette de base affecté au root DOM, via la classe `.dark`.

---

## 5. Architecture de Mise en Page (Layout)

- **Centrage Intelligent** : Utilisation de `justify-content: center` sur les conteneurs Flex (notamment la section Hero) pour garantir un équilibre visuel parfait sur les écrans ultra-larges.
- **Synchronisation de l'Alignement** : La barre de navigation et les sections de contenu partagent la même variable de padding (`--page-pad`), assurant un alignement vertical strict du logo et des titres.
- **Accessibilité Mobile** : Les actions de projets ("Code" et "Live") sont dédoublées dans un bloc `.project-actions` visible uniquement sur mobile pour compenser l'absence de survol (hover) sur écran tactile.

Le tableau des routes gère des chargements synchrones avec redirection wildcard sécurisée vers l'accueil.
```typescript
export const routes: Routes = [
    { path: '', component: Home }, // Portfolio central
    { path: 'cv', component: Cv }, // Page de profil CV
    { path: '**', redirectTo: '' } // Fallback de sécurité 404
];
```

## 6. Fonctionnalités Avancées Implémentées

### A. Internationalisation (i18n)
Le portfolio est entièrement bilingue (**FR/EN**).
- **Service Réactif** : Utilisation de `TranslationService` basé sur les **Angular Signals**.
- **Changement à la volée** : La langue est mémorisée dans le `localStorage` et appliquée instantanément sans recharger la page.

### B. Progressive Web App (PWA)
- **Mode Hors-ligne** : Grâce à `@angular/service-worker`, le site reste accessible sans connexion.
- **Installation Native** : Un bouton d'installation est intégré dynamiquement dans la Navbar.

### C. Statistiques GitHub Dynamiques
Le composant `Projects` consomme l'**API GitHub REST** via un `GithubService` pour afficher en temps réel le nombre d'étoiles (Stars) et de partages (Forks) de chaque projet.

### D. Design Midnight Aurora & Animations
- **Aurora Halo** : Effet de halo lumineux pulsant derrière les photos de profil.
- **Modular Swiper** : Utilisation de la version modulaire de Swiper 12 pour des carrousels fluides et performants.
- **Premium Effects** : Animations de "Shimmer" (balayage lumineux) et "Float" (lévitation) appliquées aux éléments clés.

---

## 7. Maintenance et Build

- **Build de Production** : `npm run build`
- **Déploiement** : Le dossier `dist/portfolio-angular` contient les fichiers optimisés prêts pour Vercel, Netlify ou un serveur Nginx.
- **Linter & Accessibilité** : Le projet respecte les normes d'accessibilité (A11y) avec des labels ARIA et des fallbacks statiques pour chaque élément interactif.
