# 🎉 Guide Utilisateur - Plateforme "Idées Ensemble"

## ✅ Travaux Réalisés

### 1. 👥 Comptes de Test Créés

Deux comptes ont été créés pour vos tests :

#### 👤 **Compte Utilisateur Standard**
- **Email**: `user@test.fr`
- **Mot de passe**: `User123!`
- **Rôle**: Utilisateur
- **Accès**: Créer des idées, voter, commenter, signaler du contenu

#### 🔑 **Compte Administrateur**
- **Email**: `admin@test.fr`
- **Mot de passe**: `Admin123!`
- **Rôle**: Administrateur
- **Accès**: Toutes les fonctionnalités + Dashboard admin + Modération

---

### 2. 🎨 Composants Visuels Intégrés

#### ✨ Sur les Cartes d'Idées (IdeaCard)
- **Badge de Statut**: Affiche le statut de l'idée (Discussion, Approuvée, En cours, Rejetée)
- **Bouton de Partage Social**: Partager sur Facebook, Twitter, LinkedIn ou copier le lien
- **Bouton de Signalement**: Permet aux utilisateurs connectés de signaler du contenu inapproprié

#### 🔍 Filtres Avancés (FiltersBar)
- **Recherche par mot-clé**: Barre de recherche pour trouver des idées
- **Tri**: Récentes / Plus votées / Actives
- **Filtre par Catégorie**: 8 catégories disponibles:
  - 🌱 Environnement
  - 🚌 Transport
  - 🎭 Culture
  - 📚 Éducation
  - ⚕️ Santé
  - 🛡️ Sécurité
  - 🏙️ Urbanisme
  - 🏪 Économie Locale
- **Filtre par Statut**: Discussion, Approuvée, En cours, Rejetée
- **Badges actifs**: Affichage des filtres actifs avec possibilité de les supprimer

#### 📤 Upload de Fichiers (Page NewIdea)
- **Types supportés**: Images (PNG, JPG) et documents (PDF)
- **Taille maximum**: 10MB par fichier
- **Fonctionnalités**:
  - Upload multiple
  - Prévisualisation des images
  - Liste des fichiers uploadés avec taille
  - Possibilité de supprimer avant publication

#### 🏅 Badges Utilisateur (IdeaDetail)
- Affichage des badges de l'auteur (Contributeur, Votant actif, Créateur d'idées, etc.)
- Affichage des pièces jointes avec prévisualisation
- Boutons de partage social et signalement intégrés

---

### 3. 🎯 Fonctionnalités Disponibles

#### Pour tous les visiteurs
- ✅ Consulter toutes les idées
- ✅ Utiliser les filtres et la recherche
- ✅ Voir les détails d'une idée
- ✅ Partager les idées sur les réseaux sociaux

#### Pour les utilisateurs connectés
- ✅ Créer des idées avec pièces jointes
- ✅ Voter pour ou contre des idées
- ✅ Commenter les idées
- ✅ Signaler du contenu inapproprié
- ✅ Recevoir des notifications
- ✅ Gagner des badges selon l'activité
- ✅ Participer aux sondages

#### Pour les modérateurs
- ✅ Toutes les fonctionnalités utilisateur
- ✅ Gérer les signalements
- ✅ Changer le statut des idées

#### Pour les administrateurs
- ✅ Toutes les fonctionnalités précédentes
- ✅ **Dashboard Admin** avec:
  - Statistiques de la plateforme
  - Gestion des utilisateurs
  - Changement de rôles
  - Bannissement d'utilisateurs
- ✅ Gestion des catégories
- ✅ Création de sondages

---

## 🚀 Comment Tester

### 1. Test avec le Compte Utilisateur

1. **Se connecter**
   - Cliquez sur "Connexion"
   - Email: `user@test.fr`
   - Mot de passe: `User123!`

2. **Tester les fonctionnalités**
   - Parcourir les propositions avec les filtres
   - Créer une nouvelle idée avec upload de fichiers
   - Voter sur des idées
   - Commenter une idée
   - Partager une idée sur les réseaux sociaux
   - Signaler du contenu
   - Consulter vos notifications (icône cloche dans le header)

### 2. Test avec le Compte Admin

1. **Se connecter**
   - Cliquez sur "Connexion"
   - Email: `admin@test.fr`
   - Mot de passe: `Admin123!`

2. **Accéder au Dashboard Admin**
   - Cliquez sur "Admin" dans la navigation
   - Vous verrez:
     - 📊 Statistiques de la plateforme
     - 👥 Liste des utilisateurs
     - ⚙️ Gestion des rôles
     - 🚫 Bannissement d'utilisateurs

3. **Tester la modération**
   - Cliquez sur "Modération" dans la navigation
   - Gérer les signalements
   - Changer le statut des idées

4. **Tester les sondages**
   - Cliquez sur "Sondages" dans la navigation
   - Créer un nouveau sondage
   - Voter sur les sondages existants

---

## 📱 Navigation de la Plateforme

### Pages principales
- **Accueil** (`/`): Page d'accueil avec présentation
- **Propositions** (`/ideas`): Liste de toutes les idées avec filtres
- **Sondages** (`/polls`): Liste et création de sondages
- **Admin** (`/admin`): Dashboard administrateur (admin seulement)
- **Modération** (`/admin/reports`): Gestion des signalements (modérateurs/admins)

---

## 🎨 Composants UI Disponibles

Les composants suivants sont maintenant intégrés dans l'application :

1. **NotificationBell**: Cloche de notifications avec badge de compte
2. **BadgeDisplay**: Affichage des badges utilisateur avec tooltips
3. **ReportButton**: Bouton pour signaler du contenu
4. **StatusBadge**: Badge coloré pour le statut des idées
5. **SocialShare**: Boutons de partage social
6. **PollCard**: Carte d'affichage et de vote pour les sondages
7. **FiltersBar**: Barre de filtres complète avec recherche, tri, catégorie et statut
8. **StatsCard**: Cartes de statistiques pour le dashboard

---

## 🔧 Configuration Technique

### Backend (FastAPI)
- **URL**: `https://filter-integrate.preview.emergentagent.com/api`
- **Base de données**: MongoDB
- **Upload**: Fichiers stockés dans `/app/backend/uploads/`

### Frontend (React)
- **URL**: `https://filter-integrate.preview.emergentagent.com`
- **Framework**: React avec Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui

### Catégories Créées
8 catégories thématiques sont disponibles pour organiser les idées :
1. 🌱 Environnement
2. 🚌 Transport
3. 🎭 Culture
4. 📚 Éducation
5. ⚕️ Santé
6. 🛡️ Sécurité
7. 🏙️ Urbanisme
8. 🏪 Économie Locale

---

## 📝 Notes Importantes

1. **Tests manuels recommandés**: L'application est prête pour vos tests manuels
2. **Upload de fichiers**: Les fichiers sont limités à 10MB (images + PDF)
3. **Badges automatiques**: Les badges sont attribués automatiquement selon l'activité
4. **Notifications**: Vous recevez des notifications pour les votes, commentaires et changements de statut sur vos idées

---

## 🎯 Résumé des Intégrations

✅ **Comptes créés**: User + Admin avec identifiants  
✅ **Filtres intégrés**: Catégorie, Statut, Recherche, Tri  
✅ **Boutons intégrés**: Signalement, Partage social  
✅ **Upload intégré**: Formulaire de création d'idée avec pièces jointes  
✅ **Badges intégrés**: Affichage sur les profils utilisateurs  
✅ **Statuts visuels**: Badges colorés sur les idées  
✅ **Dashboard admin**: Complet avec toutes les fonctionnalités  

---

**Bon testing ! 🚀**

Si vous rencontrez des problèmes ou avez besoin de modifications, n'hésitez pas à demander !
