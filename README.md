 💡 Idées Ensemble - Plateforme Participative Citoyenne

Une plateforme web moderne permettant aux citoyens de proposer, voter et discuter des idées pour améliorer leur communauté.

![Stack](https://img.shields.io/badge/Stack-React%20%2B%20FastAPI%20%2B%20MongoDB-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 📋 Table des Matières

- [Fonctionnalités](#-fonctionnalités)
- [Architecture Technique](#-architecture-technique)
- [Prérequis](#-prérequis)
- [Installation Locale](#-installation-locale)
- [Configuration](#-configuration)
- [Déploiement en Production](#-déploiement-en-production)
- [Structure du Projet](#-structure-du-projet)
- [API Documentation](#-api-documentation)
- [Maintenance](#-maintenance)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Fonctionnalités

### Pour les Citoyens
- ✅ Création et partage d'idées avec pièces jointes (images, PDF)
- ✅ Vote pour/contre les propositions
- ✅ Commentaires et discussions
- ✅ Filtres avancés (recherche, catégorie, statut)
- ✅ Partage sur réseaux sociaux
- ✅ Système de badges et récompenses
- ✅ Notifications en temps réel
- ✅ Participation aux sondages

### Pour les Modérateurs
- ✅ Gestion des signalements
- ✅ Changement de statut des idées
- ✅ Modération du contenu

### Pour les Administrateurs
- ✅ Dashboard avec statistiques
- ✅ Gestion des utilisateurs et rôles
- ✅ Création de catégories et sondages
- ✅ Vue d'ensemble de la plateforme

---

## 🏗️ Architecture Technique

### Backend
- **Framework**: FastAPI (Python)
- **Base de données**: MongoDB
- **Authentification**: JWT (JSON Web Tokens)
- **Upload**: Support images (PNG, JPG) et PDF (max 10MB)
- **API**: RESTful avec préfixe `/api`

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Animations**: Framer Motion
- **Gestion d'état**: React Context API
- **HTTP Client**: Axios

### Base de Données
- **Type**: MongoDB (NoSQL)
- **Collections principales**:
  - `users` - Utilisateurs et authentification
  - `ideas` - Propositions citoyennes
  - `comments` - Commentaires
  - `categories` - Catégories thématiques
  - `polls` - Sondages
  - `reports` - Signalements
  - `notifications` - Notifications utilisateurs

---

## 📦 Prérequis

### Système d'exploitation
- Linux (Ubuntu 20.04+ recommandé)
- macOS 10.15+
- Windows 10+ (avec WSL2)

### Logiciels requis
- **Node.js**: v18.x ou supérieur
- **Python**: v3.9 ou supérieur
- **MongoDB**: v5.0 ou supérieur
- **Yarn**: v1.22+ (gestionnaire de paquets)
- **Git**: Pour le contrôle de version

### Ports requis
- `3000` - Frontend React (développement)
- `8001` - Backend FastAPI
- `27017` - MongoDB

---

## 🚀 Installation Locale

### 1. Cloner le Repository

```bash
git clone https://github.com/votre-repo/plateforme-participative.git
cd plateforme-participative
```

### 2. Installer MongoDB

**Ubuntu/Debian:**
```bash
# Importer la clé GPG MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -

# Ajouter le repository MongoDB
echo \"deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse\" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list

# Installer MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Démarrer MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

**macOS (avec Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community@5.0
brew services start mongodb-community@5.0
```

**Vérifier l'installation:**
```bash
mongosh --version
```

### 3. Configuration Backend

```bash
cd backend

# Créer un environnement virtuel Python
python3 -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Créer le fichier .env
cat > .env << EOF
MONGO_URL=mongodb://localhost:27017
DB_NAME=idees_ensemble
JWT_SECRET=$(openssl rand -hex 32)
CORS_ORIGINS=http://localhost:3000
EOF

# Créer les catégories par défaut
python3 seed_categories.py

# Créer les comptes de test (optionnel)
python3 create_test_accounts.py
```

### 4. Configuration Frontend

```bash
cd ../frontend

# Installer les dépendances
yarn install

# Créer le fichier .env
cat > .env << EOF
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=3000
REACT_APP_ENABLE_VISUAL_EDITS=true
ENABLE_HEALTH_CHECK=false
EOF
```

### 5. Lancer l'Application

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
yarn start
```

L'application sera accessible sur `http://localhost:3000`

---

## ⚙️ Configuration

### Variables d'Environnement

#### Backend (`backend/.env`)

```bash
# MongoDB Configuration
MONGO_URL=mongodb://localhost:27017        # URL de connexion MongoDB
DB_NAME=idees_ensemble                     # Nom de la base de données

# Security
JWT_SECRET=votre-secret-jwt-aleatoire     # Clé secrète JWT (générer avec: openssl rand -hex 32)

# CORS (Cross-Origin Resource Sharing)
CORS_ORIGINS=http://localhost:3000         # URLs autorisées (séparées par des virgules)
```

#### Frontend (`frontend/.env`)

```bash
# Backend API URL
REACT_APP_BACKEND_URL=http://localhost:8001

# Development Settings
WDS_SOCKET_PORT=3000
REACT_APP_ENABLE_VISUAL_EDITS=true
ENABLE_HEALTH_CHECK=false
```

### Configuration MongoDB

**Créer un utilisateur admin (production recommandée):**
```bash
mongosh

use admin
db.createUser({
  user: \"admin\",
  pwd: \"votre_mot_de_passe_securise\",
  roles: [ { role: \"userAdminAnyDatabase\", db: \"admin\" } ]
})

use idees_ensemble
db.createUser({
  user: \"idees_user\",
  pwd: \"votre_mot_de_passe_securise\",
  roles: [ { role: \"readWrite\", db: \"idees_ensemble\" } ]
})
```

**Mettre à jour MONGO_URL avec authentification:**
```bash
MONGO_URL=mongodb://idees_user:votre_mot_de_passe@localhost:27017/idees_ensemble
```

---

## 🌐 Déploiement en Production

### Option 1: Déploiement avec Docker

#### 1. Créer le Dockerfile Backend

```dockerfile
# backend/Dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p /app/uploads

EXPOSE 8001

CMD [\"uvicorn\", \"server:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8001\"]
```

#### 2. Créer le Dockerfile Frontend

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD [\"nginx\", \"-g\", \"daemon off;\"]
```

#### 3. Créer nginx.conf

```nginx
# frontend/nginx.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 4. Créer docker-compose.yml

```yaml
# docker-compose.yml
version: '3.8'

services:
  mongodb:
    image: mongo:5.0
    container_name: idees_mongodb
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
      MONGO_INITDB_DATABASE: idees_ensemble
    volumes:
      - mongodb_data:/data/db
    ports:
      - \"27017:27017\"
    networks:
      - idees_network

  backend:
    build: ./backend
    container_name: idees_backend
    restart: always
    environment:
      MONGO_URL: mongodb://admin:${MONGO_ROOT_PASSWORD}@mongodb:27017/idees_ensemble?authSource=admin
      DB_NAME: idees_ensemble
      JWT_SECRET: ${JWT_SECRET}
      CORS_ORIGINS: ${FRONTEND_URL}
    volumes:
      - uploads_data:/app/uploads
    ports:
      - \"8001:8001\"
    depends_on:
      - mongodb
    networks:
      - idees_network

  frontend:
    build: ./frontend
    container_name: idees_frontend
    restart: always
    environment:
      REACT_APP_BACKEND_URL: ${BACKEND_URL}
    ports:
      - \"80:80\"
    depends_on:
      - backend
    networks:
      - idees_network

volumes:
  mongodb_data:
  uploads_data:

networks:
  idees_network:
    driver: bridge
```

#### 5. Créer .env pour Docker

```bash
# .env (à la racine du projet)
MONGO_ROOT_PASSWORD=votre_mot_de_passe_mongo_securise
JWT_SECRET=votre_secret_jwt_aleatoire
FRONTEND_URL=https://votre-domaine.com
BACKEND_URL=https://api.votre-domaine.com
```

#### 6. Lancer avec Docker Compose

```bash
# Build et démarrer
docker-compose up -d --build

# Vérifier les logs
docker-compose logs -f

# Arrêter
docker-compose down

# Arrêter et supprimer les volumes
docker-compose down -v
```

### Option 2: Déploiement sur VPS (Ubuntu)

#### 1. Préparer le Serveur

```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer les dépendances
sudo apt install -y python3 python3-pip python3-venv nodejs npm mongodb nginx certbot python3-certbot-nginx

# Installer Yarn
npm install -g yarn

# Créer un utilisateur pour l'application
sudo adduser --disabled-password --gecos \"\" idees
sudo usermod -aG sudo idees
```

#### 2. Cloner et Configurer

```bash
# Se connecter en tant qu'utilisateur idees
sudo su - idees

# Cloner le projet
git clone https://github.com/votre-repo/plateforme-participative.git
cd plateforme-participative

# Configurer le backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Éditer .env avec vos valeurs
nano .env

# Initialiser la base de données
python3 seed_categories.py

# Configurer le frontend
cd ../frontend
yarn install
cp .env.example .env
# Éditer .env avec vos valeurs
nano .env

# Build du frontend
yarn build
```

#### 3. Créer les Services Systemd

**Backend Service:**
```bash
sudo nano /etc/systemd/system/idees-backend.service
```

```ini
[Unit]
Description=Idees Ensemble Backend
After=network.target mongodb.service

[Service]
Type=simple
User=idees
WorkingDirectory=/home/idees/plateforme-participative/backend
Environment=\"PATH=/home/idees/plateforme-participative/backend/venv/bin\"
ExecStart=/home/idees/plateforme-participative/backend/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Activer et démarrer:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable idees-backend
sudo systemctl start idees-backend
sudo systemctl status idees-backend
```

#### 4. Configurer Nginx

```bash
sudo nano /etc/nginx/sites-available/idees-ensemble
```

```nginx
# Configuration HTTP (avant SSL)
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;

    # Frontend
    root /home/idees/plateforme-participative/frontend/build;
    index index.html;

    # Logs
    access_log /var/log/nginx/idees-access.log;
    error_log /var/log/nginx/idees-error.log;

    # Frontend routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploads
    location /uploads {
        alias /home/idees/plateforme-participative/backend/uploads;
        expires 30d;
        add_header Cache-Control \"public, immutable\";
    }

    # Security headers
    add_header X-Frame-Options \"SAMEORIGIN\" always;
    add_header X-Content-Type-Options \"nosniff\" always;
    add_header X-XSS-Protection \"1; mode=block\" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

**Activer le site:**
```bash
sudo ln -s /etc/nginx/sites-available/idees-ensemble /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 5. Configurer SSL avec Let's Encrypt

```bash
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com

# Tester le renouvellement automatique
sudo certbot renew --dry-run
```

#### 6. Configurer le Firewall

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

### Option 3: Déploiement sur Services Cloud

#### Heroku

**Backend (FastAPI):**
```bash
# Créer Procfile
echo \"web: uvicorn server:app --host 0.0.0.0 --port \$PORT\" > backend/Procfile

# Créer runtime.txt
echo \"python-3.9.16\" > backend/runtime.txt

# Déployer
heroku create idees-ensemble-api
heroku addons:create mongolab:sandbox
heroku config:set JWT_SECRET=$(openssl rand -hex 32)
git subtree push --prefix backend heroku master
```

**Frontend (React):**
```bash
# Créer un projet sur Vercel/Netlify
# Configurer les variables d'environnement
# Build command: yarn build
# Publish directory: build
```
Excellent ! Je vais créer un guide détaillé pour déployer votre application sur différents services cloud. Voici les meilleures combinaisons :
Action: file_editor create /app/DEPLOIEMENT_CLOUD.md --file-text "# ☁️ Guide de Déploiement Cloud - Idées Ensemble

Ce guide détaille le déploiement de la plateforme sur différents services cloud gratuits ou peu coûteux.

## 📋 Table des Matières

- [Architecture Cloud Recommandée](#architecture-cloud-recommandée)
- [Option 1: Vercel + Railway + MongoDB Atlas](#option-1-vercel--railway--mongodb-atlas-recommandé)
- [Option 2: Netlify + Render + MongoDB Atlas](#option-2-netlify--render--mongodb-atlas)
- [Option 3: Heroku (Backend + Frontend)](#option-3-heroku-tout-en-un)
- [Option 4: AWS (EC2 + S3)](#option-4-aws-ec2--s3)
- [Configuration DNS](#configuration-dns)
- [Variables d'Environnement](#variables-denvironnement)
- [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture Cloud Recommandée

```
┌─────────────────────────────────────────────────────┐
│                                                       │
│  FRONTEND (React)                                    │
│  ├─ Vercel / Netlify / AWS S3 + CloudFront         │
│  └─ CDN Global                                       │
│                                                       │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ HTTPS
                   ▼
┌─────────────────────────────────────────────────────┐
│                                                       │
│  BACKEND (FastAPI)                                   │
│  ├─ Railway / Render / Heroku                       │
│  ├─ API REST                                         │
│  └─ Upload de fichiers                              │
│                                                       │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ MongoDB Protocol
                   ▼
┌─────────────────────────────────────────────────────┐
│                                                       │
│  DATABASE (MongoDB)                                  │
│  ├─ MongoDB Atlas (gratuit 512MB)                   │
│  ├─ Backups automatiques                            │
│  └─ Réplication                                      │
│                                                       │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Option 1: Vercel + Railway + MongoDB Atlas (Recommandé)

### Pourquoi cette combinaison ?
- ✅ **Gratuit** : Tous les services ont un tier gratuit
- ✅ **Simple** : Déploiement automatique depuis Git
- ✅ **Performant** : CDN global pour le frontend
- ✅ **Scalable** : Peut grandir avec votre projet

---

### Étape 1 : MongoDB Atlas (Base de données)

#### 1.1 Créer un compte MongoDB Atlas

1. Aller sur https://www.mongodb.com/cloud/atlas
2. Cliquer sur \"Try Free\" ou \"Sign Up\"
3. Créer un compte avec votre email
4. Sélectionner \"Shared\" (gratuit)

#### 1.2 Créer un cluster gratuit

```
1. Sélectionnez un fournisseur cloud :
   - AWS, Google Cloud ou Azure (tous gratuits)
   - Région la plus proche de vos utilisateurs

2. Nom du cluster : idees-ensemble-cluster
3. Cliquer sur \"Create Cluster\" (prend 3-5 minutes)
```

#### 1.3 Configurer l'accès réseau

```
1. Dans le menu gauche : \"Network Access\"
2. Cliquer sur \"Add IP Address\"
3. Cliquer sur \"Allow Access from Anywhere\" (0.0.0.0/0)
   ⚠️ Note : En production, restreindre aux IPs de vos services
4. Cliquer sur \"Confirm\"
```

#### 1.4 Créer un utilisateur de base de données

```
1. Dans le menu gauche : \"Database Access\"
2. Cliquer sur \"Add New Database User\"
3. Authentication Method : Password
4. Username : idees_admin
5. Password : Générer un mot de passe sécurisé (noter le !)
6. Database User Privileges : \"Read and write to any database\"
7. Cliquer sur \"Add User\"
```

#### 1.5 Récupérer la chaîne de connexion

```
1. Dans le menu gauche : \"Database\" → \"Connect\"
2. Choisir \"Connect your application\"
3. Driver : Python / Version : 3.12 or later
4. Copier la connection string :

mongodb+srv://idees_admin:<password>@idees-ensemble-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority

5. Remplacer <password> par votre vrai mot de passe
6. Ajouter le nom de la base après .net/ :

mongodb+srv://idees_admin:VOTRE_PASSWORD@idees-ensemble-cluster.xxxxx.mongodb.net/idees_ensemble?retryWrites=true&w=majority
```

✅ **Sauvegarder cette URL** - vous en aurez besoin !

---

### Étape 2 : Railway (Backend FastAPI)

#### 2.1 Préparer le projet Backend

**Créer `railway.json` dans le dossier backend :**
```json
{
  \"$schema\": \"https://railway.app/railway.schema.json\",
  \"build\": {
    \"builder\": \"NIXPACKS\"
  },
  \"deploy\": {
    \"startCommand\": \"uvicorn server:app --host 0.0.0.0 --port $PORT\",
    \"restartPolicyType\": \"ON_FAILURE\",
    \"restartPolicyMaxRetries\": 10
  }
}
```

**Créer `nixpacks.toml` dans le dossier backend :**
```toml
[phases.setup]
nixPkgs = ['python39']

[phases.install]
cmds = ['pip install -r requirements.txt']

[phases.build]
cmds = ['python seed_categories.py']

[start]
cmd = 'uvicorn server:app --host 0.0.0.0 --port $PORT'
```

#### 2.2 Déployer sur Railway

1. **Aller sur https://railway.app**
2. Cliquer sur \"Start a New Project\"
3. Se connecter avec GitHub
4. Cliquer sur \"Deploy from GitHub repo\"
5. Sélectionner votre repository
6. Cliquer sur \"Add variables\"

**Variables d'environnement à ajouter :**
```bash
MONGO_URL=mongodb+srv://idees_admin:VOTRE_PASSWORD@cluster.xxxxx.mongodb.net/idees_ensemble?retryWrites=true&w=majority
DB_NAME=idees_ensemble
JWT_SECRET=GENERER_UN_SECRET_ALEATOIRE_32_CARACTERES
CORS_ORIGINS=https://votre-app.vercel.app
PORT=8001
```

7. Cliquer sur \"Deploy\"
8. Attendre le déploiement (2-3 minutes)
9. Copier l'URL générée (ex: `https://idees-ensemble-production.up.railway.app`)

#### 2.3 Configurer le domaine personnalisé (optionnel)

```
1. Dans Railway : Settings → Domains
2. Cliquer sur \"Generate Domain\"
3. Ou ajouter votre propre domaine
```

✅ **Sauvegarder l'URL du backend** !

---

### Étape 3 : Vercel (Frontend React)

#### 3.1 Préparer le projet Frontend

**Créer `vercel.json` dans le dossier frontend :**
```json
{
  \"version\": 2,
  \"builds\": [
    {
      \"src\": \"package.json\",
      \"use\": \"@vercel/static-build\",
      \"config\": {
        \"distDir\": \"build\"
      }
    }
  ],
  \"routes\": [
    {
      \"src\": \"/static/(.*)\",
      \"headers\": {
        \"cache-control\": \"public, max-age=31536000, immutable\"
      }
    },
    {
      \"src\": \"/(.*)\",
      \"dest\": \"/index.html\"
    }
  ]
}
```

**Créer `.vercelignore` dans le dossier frontend :**
```
node_modules
.env.local
.env
```

#### 3.2 Déployer sur Vercel

1. **Aller sur https://vercel.com**
2. Cliquer sur \"Sign Up\" et se connecter avec GitHub
3. Cliquer sur \"Add New...\" → \"Project\"
4. Importer votre repository GitHub
5. Configurer le projet :

```
Framework Preset : Create React App
Root Directory : frontend
Build Command : yarn build
Output Directory : build
Install Command : yarn install
```

6. **Variables d'environnement** (Environment Variables) :

```bash
REACT_APP_BACKEND_URL=https://votre-backend.up.railway.app
REACT_APP_ENABLE_VISUAL_EDITS=true
```

7. Cliquer sur \"Deploy\"
8. Attendre le déploiement (2-3 minutes)
9. Votre app sera disponible sur `https://votre-app.vercel.app`

#### 3.3 Configurer le domaine personnalisé

```
1. Dans Vercel : Settings → Domains
2. Ajouter votre domaine (ex: idees-ensemble.com)
3. Suivre les instructions DNS
4. SSL automatique activé ✅
```

#### 3.4 Mettre à jour CORS sur Railway

Retourner sur Railway et mettre à jour la variable :
```bash
CORS_ORIGINS=https://votre-app.vercel.app,https://votre-domaine.com
```

---

### Étape 4 : Initialiser la base de données

#### 4.1 Exécuter les scripts d'initialisation

**Via Railway CLI :**

```bash
# Installer Railway CLI
npm install -g @railway/cli

# Se connecter
railway login

# Lier au projet
railway link

# Exécuter les scripts
railway run python seed_categories.py
railway run python create_test_accounts.py
```

**Ou via MongoDB Compass :**

1. Télécharger MongoDB Compass : https://www.mongodb.com/try/download/compass
2. Se connecter avec votre URL MongoDB Atlas
3. Créer manuellement la base `idees_ensemble`
4. Les collections seront créées automatiquement au premier usage

---

## 🎯 Option 2: Netlify + Render + MongoDB Atlas

### Avantages
- Interface plus simple que Vercel
- Render a un bon tier gratuit
- Bon pour les débutants

### Étape 1 : MongoDB Atlas
Suivre les mêmes étapes que l'Option 1

### Étape 2 : Render (Backend)

#### 2.1 Créer un compte Render

1. Aller sur https://render.com
2. Cliquer sur \"Get Started\"
3. Se connecter avec GitHub

#### 2.2 Créer un Web Service

```
1. Cliquer sur \"New +\" → \"Web Service\"
2. Connecter votre repository GitHub
3. Configuration :

Name : idees-ensemble-backend
Region : Choisir le plus proche
Branch : main
Root Directory : backend
Runtime : Python 3
Build Command : pip install -r requirements.txt
Start Command : uvicorn server:app --host 0.0.0.0 --port $PORT
```

#### 2.3 Variables d'environnement

```bash
MONGO_URL=votre_url_mongodb_atlas
DB_NAME=idees_ensemble
JWT_SECRET=votre_secret_jwt
CORS_ORIGINS=https://votre-app.netlify.app
PORT=10000
```

4. Sélectionner \"Free\" plan
5. Cliquer sur \"Create Web Service\"
6. Copier l'URL générée

### Étape 3 : Netlify (Frontend)

#### 3.1 Créer un compte Netlify

1. Aller sur https://netlify.com
2. Cliquer sur \"Sign Up\" avec GitHub

#### 3.2 Déployer le site

```
1. Cliquer sur \"Add new site\" → \"Import an existing project\"
2. Choisir GitHub
3. Sélectionner votre repository
4. Configuration :

Base directory : frontend
Build command : yarn build
Publish directory : frontend/build
```

#### 3.3 Variables d'environnement

```
Site settings → Build & deploy → Environment

REACT_APP_BACKEND_URL=https://votre-backend.onrender.com
REACT_APP_ENABLE_VISUAL_EDITS=true
```

5. Cliquer sur \"Deploy site\"
6. Votre URL : `https://random-name.netlify.app`

#### 3.4 Domaine personnalisé

```
Site settings → Domain management → Add custom domain
```

---

## 🔷 Option 3: Heroku (Tout-en-un)

### Avantages
- Tout sur une seule plateforme
- Simple à gérer
- Bon pour prototypes

### ⚠️ Note : Heroku n'est plus gratuit depuis novembre 2022

**Plan minimum : ~$5/mois par service**

### Étape 1 : Installation CLI

```bash
# macOS
brew tap heroku/brew && brew install heroku

# Ubuntu/Debian
curl https://cli-assets.heroku.com/install.sh | sh

# Windows
# Télécharger l'installeur : https://cli-assets.heroku.com/heroku-x64.exe
```

### Étape 2 : Connexion

```bash
heroku login
```

### Étape 3 : Déployer le Backend

```bash
cd backend

# Créer l'app Heroku
heroku create idees-ensemble-api

# Ajouter MongoDB
heroku addons:create mongocloud:free
# OU utiliser MongoDB Atlas
heroku config:set MONGO_URL=\"votre_url_mongodb_atlas\"

# Variables d'environnement
heroku config:set JWT_SECRET=$(openssl rand -hex 32)
heroku config:set CORS_ORIGINS=\"*\"

# Créer Procfile
echo \"web: uvicorn server:app --host=0.0.0.0 --port=\$PORT\" > Procfile

# Créer runtime.txt
echo \"python-3.9.16\" > runtime.txt

# Déployer
git add .
git commit -m \"Prepare for Heroku\"
git push heroku main

# Vérifier les logs
heroku logs --tail
```

### Étape 4 : Déployer le Frontend

**Option A : Héberger sur Heroku**

```bash
cd frontend

# Créer l'app
heroku create idees-ensemble-web

# Ajouter le buildpack Node.js
heroku buildpacks:set heroku/nodejs

# Variables d'environnement
heroku config:set REACT_APP_BACKEND_URL=\"https://idees-ensemble-api.herokuapp.com\"

# Créer un fichier static.json (pour SPA routing)
cat > static.json << EOF
{
  \"root\": \"build/\",
  \"routes\": {
    \"/**\": \"index.html\"
  },
  \"headers\": {
    \"/**\": {
      \"Cache-Control\": \"public, max-age=0, must-revalidate\"
    },
    \"/static/**\": {
      \"Cache-Control\": \"public, max-age=31536000, immutable\"
    }
  }
}
EOF

# Modifier package.json pour ajouter le buildpack
# Ajouter dans scripts:
\"heroku-postbuild\": \"yarn build\"

# Déployer
git add .
git commit -m \"Prepare frontend for Heroku\"
git push heroku main
```

**Option B : Utiliser Vercel/Netlify pour le frontend**
(Plus économique, suivre Option 1 ou 2)

---

## 🌩️ Option 4: AWS (Pour production à grande échelle)

### Architecture AWS

```
Frontend : S3 + CloudFront
Backend : EC2 ou ECS (Docker)
Database : DocumentDB ou MongoDB Atlas
Storage : S3 pour les uploads
```

### Étape 1 : Frontend sur S3 + CloudFront

#### 1.1 Créer un bucket S3

```bash
# Via AWS CLI
aws s3 mb s3://idees-ensemble-frontend --region eu-west-1

# Configurer pour hébergement web
aws s3 website s3://idees-ensemble-frontend \
  --index-document index.html \
  --error-document index.html
```

#### 1.2 Build et Upload

```bash
cd frontend
yarn build

# Upload vers S3
aws s3 sync build/ s3://idees-ensemble-frontend --delete
```

#### 1.3 Créer une distribution CloudFront

```
1. Aller sur AWS Console → CloudFront
2. Create Distribution
3. Origin : Votre bucket S3
4. Default Root Object : index.html
5. Create
6. Copier le domaine CloudFront
```

### Étape 2 : Backend sur EC2

#### 2.1 Lancer une instance EC2

```
1. AWS Console → EC2 → Launch Instance
2. AMI : Ubuntu Server 22.04 LTS
3. Instance type : t2.micro (gratuit)
4. Configure Security Group :
   - SSH (22) depuis votre IP
   - HTTP (80) depuis 0.0.0.0/0
   - HTTPS (443) depuis 0.0.0.0/0
   - Custom TCP (8001) depuis 0.0.0.0/0
5. Launch
```

#### 2.2 Se connecter et installer

```bash
# Se connecter
ssh -i votre-cle.pem ubuntu@ec2-ip-address

# Suivre le guide \"Installation Locale\" du README.md principal
# Puis configurer Nginx comme décrit
```

### Étape 3 : Base de données

**Option A : MongoDB Atlas** (Recommandé)
- Suivre l'Étape 1 de l'Option 1

**Option B : Amazon DocumentDB**
```
1. AWS Console → DocumentDB
2. Create cluster
3. Instance class : db.t3.medium (minimum)
4. Coût : ~$200/mois
```

---

## 🌐 Configuration DNS

### Pour un domaine personnalisé

#### Exemple avec Cloudflare (gratuit)

1. **Ajouter votre domaine à Cloudflare**
   - Créer un compte sur https://cloudflare.com
   - Ajouter votre domaine
   - Changer les nameservers chez votre registrar

2. **Configurer les enregistrements DNS**

```
Type    Name    Content                              Proxy
CNAME   @       votre-app.vercel.app                 Activé
CNAME   www     votre-app.vercel.app                 Activé
CNAME   api     votre-backend.up.railway.app         Activé
```

3. **Activer SSL/TLS**
   - SSL/TLS → Overview → Full (strict)

4. **Mettre à jour les services**

**Vercel :**
```
Settings → Domains → Add idees-ensemble.com
```

**Railway :**
```
Settings → Domains → Custom Domain → api.idees-ensemble.com
```

5. **Mettre à jour les variables d'environnement**

```bash
# Backend (Railway)
CORS_ORIGINS=https://idees-ensemble.com,https://www.idees-ensemble.com

# Frontend (Vercel)
REACT_APP_BACKEND_URL=https://api.idees-ensemble.com
```

---

## 🔐 Variables d'Environnement - Récapitulatif

### Backend (Railway/Render/Heroku)

```bash
# Base de données MongoDB
MONGO_URL=mongodb+srv://user:password@cluster.mongodb.net/dbname
DB_NAME=idees_ensemble

# Sécurité
JWT_SECRET=votre_secret_jwt_32_caracteres_minimum

# CORS - Autoriser les domaines frontend
CORS_ORIGINS=https://votre-domaine.com,https://www.votre-domaine.com

# Port (géré automatiquement par la plateforme)
PORT=$PORT
```

**Générer un JWT_SECRET sécurisé :**
```bash
# En ligne de commande
openssl rand -hex 32

# Ou en Python
python -c \"import secrets; print(secrets.token_hex(32))\"

# Ou en Node.js
node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"
```

### Frontend (Vercel/Netlify)

```bash
# URL du backend
REACT_APP_BACKEND_URL=https://api.votre-domaine.com

# Features (optionnel)
REACT_APP_ENABLE_VISUAL_EDITS=true
```

---

## 🔍 Vérification du Déploiement

### Checklist Post-Déploiement

```bash
# 1. Vérifier le backend
curl https://votre-backend.com/api/stats

# 2. Vérifier la documentation API
https://votre-backend.com/docs

# 3. Tester l'authentification
curl -X POST https://votre-backend.com/api/auth/login \
  -H \"Content-Type: application/json\" \
  -d '{\"email\":\"admin@test.fr\",\"password\":\"Admin123!\"}'

# 4. Vérifier le frontend
https://votre-frontend.com

# 5. Tester le parcours complet
- Inscription
- Connexion
- Créer une idée
- Voter
- Upload fichier
```

---

## 🐛 Troubleshooting Cloud

### Erreur : Cannot connect to MongoDB

**Causes possibles :**

1. **IP non autorisée**
```
MongoDB Atlas → Network Access → Add IP Address → 0.0.0.0/0
```

2. **Mauvaise connection string**
```
Vérifier :
- Le mot de passe (pas de caractères spéciaux encodés)
- Le nom de la base après .net/
- Exemple correct :
mongodb+srv://user:pass@cluster.net/dbname?retryWrites=true
```

3. **User permissions**
```
MongoDB Atlas → Database Access → 
Vérifier que l'utilisateur a \"Read and write to any database\"
```

### Erreur CORS sur le frontend

```bash
# 1. Vérifier la variable CORS_ORIGINS sur le backend
# 2. S'assurer qu'elle contient l'URL du frontend
CORS_ORIGINS=https://votre-app.vercel.app

# 3. Redéployer le backend après modification
```

### Upload de fichiers ne fonctionne pas

**Railway/Render :**
```
⚠️ Le système de fichiers est éphémère !
Les uploads sont perdus au redémarrage.

Solution : Utiliser un service de stockage cloud
- AWS S3
- Cloudinary
- UploadCare
```

**Migration vers S3 (voir ci-dessous)**

### Backend se met en veille (Free tier)

**Railway :**
- Free tier : pas de mise en veille
- ✅ Toujours actif

**Render :**
- Free tier : se met en veille après 15 minutes d'inactivité
- Premier appel après veille : ~30 secondes
- Solution : Upgrade au plan payant ($7/mois)

**Heroku :**
- Plus de tier gratuit
- Plan minimum : $5/mois

---

## 📦 Stockage des Fichiers - Migration vers S3

### Configuration AWS S3 pour les uploads

#### 1. Créer un bucket S3

```bash
# Via AWS Console
1. S3 → Create bucket
2. Bucket name : idees-ensemble-uploads
3. Region : eu-west-1
4. Block Public Access : Décocher (on gère via CORS)
5. Create bucket
```

#### 2. Configurer CORS

```json
[
  {
    \"AllowedHeaders\": [\"*\"],
    \"AllowedMethods\": [\"GET\", \"PUT\", \"POST\", \"DELETE\"],
    \"AllowedOrigins\": [\"https://votre-domaine.com\"],
    \"ExposeHeaders\": [\"ETag\"]
  }
]
```

#### 3. Créer un utilisateur IAM

```
1. IAM → Users → Add user
2. Username : idees-uploads-user
3. Access type : Programmatic access
4. Permissions : AmazonS3FullAccess
5. Créer et copier :
   - Access Key ID
   - Secret Access Key
```

#### 4. Modifier le backend

```bash
# Installer boto3
pip install boto3

# Ajouter variables d'environnement
AWS_ACCESS_KEY_ID=votre_access_key
AWS_SECRET_ACCESS_KEY=votre_secret_key
AWS_S3_BUCKET_NAME=idees-ensemble-uploads
AWS_REGION=eu-west-1
```

#### 5. Mettre à jour server.py

```python
import boto3
from botocore.exceptions import ClientError

# Configuration S3
s3_client = boto3.client(
    's3',
    aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY'),
    region_name=os.environ.get('AWS_REGION', 'eu-west-1')
)

BUCKET_NAME = os.environ.get('AWS_S3_BUCKET_NAME')

@api_router.post(\"/upload\")
async def upload_file(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    try:
        # Générer un nom de fichier unique
        file_ext = file.filename.split('.')[-1]
        filename = f\"{uuid.uuid4()}.{file_ext}\"
        
        # Upload vers S3
        s3_client.upload_fileobj(
            file.file,
            BUCKET_NAME,
            filename,
            ExtraArgs={
                'ContentType': file.content_type,
                'ACL': 'public-read'
            }
        )
        
        # URL publique
        file_url = f\"https://{BUCKET_NAME}.s3.{os.environ.get('AWS_REGION')}.amazonaws.com/{filename}\"
        
        attachment = Attachment(
            filename=file.filename,
            file_type=file.content_type,
            file_size=file.size,
            url=file_url
        )
        
        await db.attachments.insert_one(attachment.model_dump())
        return attachment
        
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))

---

## 💰 Coûts Estimés

### Option 1 : Vercel + Railway + MongoDB Atlas

| Service | Tier | Coût |
|---------|------|------|
| Vercel (Frontend) | Hobby | Gratuit |
| Railway (Backend) | Free | Gratuit (500h/mois) |
| MongoDB Atlas | M0 | Gratuit (512MB) |
| **Total** | | **0€/mois** |

Limites :
- Vercel : 100GB bandwidth/mois
- Railway : 500 heures d'exécution/mois
- MongoDB : 512MB de stockage

### Option 2 : Netlify + Render + MongoDB Atlas

| Service | Tier | Coût |
|---------|------|------|
| Netlify (Frontend) | Free | Gratuit |
| Render (Backend) | Free | Gratuit |
| MongoDB Atlas | M0 | Gratuit |
| **Total** | | **0€/mois** |

Limites :
- Render : Se met en veille après 15min d'inactivité

### Option 3 : Production (Recommandé pour trafic réel)

| Service | Tier | Coût |
|---------|------|------|
| Vercel | Pro | $20/mois |
| Railway | Starter | $5/mois |
| MongoDB Atlas | M10 | $57/mois |
| AWS S3 | Standard | ~$3/mois |
| **Total** | | **~85€/mois** |

---

## 📊 Monitoring et Analytics

### Vercel Analytics

```
1. Vercel Dashboard → Analytics
2. Activer Web Analytics
3. Voir les métriques en temps réel
```

### Railway Logs

```bash
# Voir les logs en temps réel
railway logs

# Ou dans l'interface web
Project → Deployments → View Logs
```

### MongoDB Atlas Monitoring

```
1. Atlas Dashboard → Metrics
2. Voir :
   - Connexions
   - Operations/seconde
   - Storage utilisé
```

---

## 🎯 Conclusion

### Recommandation par cas d'usage

**Prototype / MVP (0€) :**
```
✅ Vercel + Railway + MongoDB Atlas
✅ Déploiement en 30 minutes
✅ Parfait pour tester
```

**Production Légère (~20€/mois) :**
```
✅ Vercel Pro + Railway Starter + MongoDB Atlas M2
✅ Support SSL automatique
✅ Backups automatiques
```

**Production Scalable (~100€/mois) :**
```
✅ AWS (S3 + CloudFront + EC2 + MongoDB Atlas M10)
✅ Contrôle total
✅ Peut servir des milliers d'utilisateurs
```

---

## 📞 Support

Pour des questions spécifiques au déploiement cloud :
- Vercel : https://vercel.com/docs
- Railway : https://docs.railway.app
- Render : https://render.com/docs
- MongoDB Atlas : https://docs.atlas.mongodb.com
- Netlify : https://docs.netlify.com


---

## 📁 Structure du Projet

```
plateforme-participative/
├── backend/
│   ├── server.py                 # Application FastAPI principale
│   ├── requirements.txt          # Dépendances Python
│   ├── seed_categories.py        # Script d'initialisation catégories
│   ├── create_test_accounts.py   # Script création comptes test
│   ├── .env                      # Variables d'environnement (à créer)
│   └── uploads/                  # Dossier des fichiers uploadés
│
├── frontend/
│   ├── public/                   # Fichiers statiques
│   ├── src/
│   │   ├── components/           # Composants React réutilisables
│   │   │   ├── ui/              # Composants UI de base (shadcn)
│   │   │   ├── IdeaCard.js      # Carte d'idée
│   │   │   ├── FiltersBar.js    # Barre de filtres
│   │   │   ├── Header.js        # En-tête navigation
│   │   │   ├── NotificationBell.js
│   │   │   ├── BadgeDisplay.js
│   │   │   └── ...
│   │   ├── pages/               # Pages de l'application
│   │   │   ├── Home.js
│   │   │   ├── IdeasList.js
│   │   │   ├── IdeaDetail.js
│   │   │   ├── NewIdea.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── ReportsModeration.js
│   │   │   └── Polls.js
│   │   ├── contexts/            # Contextes React
│   │   │   └── AuthContext.js
│   │   ├── hooks/               # Hooks personnalisés
│   │   ├── App.js               # Composant racine
│   │   └── index.js             # Point d'entrée
│   ├── package.json             # Dépendances Node.js
│   ├── tailwind.config.js       # Configuration Tailwind
│   └── .env                     # Variables d'environnement (à créer)
│
├── tests/                        # Tests automatisés
├── GUIDE_UTILISATEUR.md         # Guide pour les utilisateurs
├── README.md                     # Ce fichier
└── docker-compose.yml           # Configuration Docker (optionnel)
```

---

## 📚 API Documentation

### Authentification

#### Inscription
```http
POST /api/auth/register
Content-Type: application/json

{
  \"email\": \"user@example.com\",
  \"password\": \"password123\",
  \"name\": \"John Doe\"
}
```

#### Connexion
```http
POST /api/auth/login
Content-Type: application/json

{
  \"email\": \"user@example.com\",
  \"password\": \"password123\"
}
```

### Idées

#### Lister les idées
```http
GET /api/ideas?sort=recent&category=cat_id&status=discussion&search=query
```

#### Créer une idée
```http
POST /api/ideas
Authorization: Bearer {token}
Content-Type: application/json

{
  \"title\": \"Mon idée\",
  \"description\": \"Description détaillée\",
  \"tags\": [\"Environnement\", \"Transport\"],
  \"attachments\": [\"attachment_id_1\", \"attachment_id_2\"]
}
```

#### Voter
```http
POST /api/ideas/{idea_id}/vote
Authorization: Bearer {token}
Content-Type: application/json

{
  \"action\": \"up\" | \"down\" | \"remove\"
}
```

### Upload

```http
POST /api/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [fichier]
```

### Administration

#### Statistiques
```http
GET /api/admin/stats
Authorization: Bearer {admin_token}
```

#### Gérer les utilisateurs
```http
GET /api/admin/users
PUT /api/admin/users/{user_id}/role
PUT /api/admin/users/{user_id}/ban
Authorization: Bearer {admin_token}
```

Pour la documentation complète, démarrez le serveur et visitez: `http://localhost:8001/docs`

---

## 🛠️ Maintenance

### Sauvegardes MongoDB

**Sauvegarde manuelle:**
```bash
mongodump --db idees_ensemble --out /backup/$(date +%Y%m%d)
```

**Script de sauvegarde automatique:**
```bash
#!/bin/bash
# /usr/local/bin/backup-idees.sh

BACKUP_DIR=\"/backup/mongodb\"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
mongodump --db idees_ensemble --out $BACKUP_DIR/$DATE
tar -czf $BACKUP_DIR/idees_ensemble_$DATE.tar.gz -C $BACKUP_DIR $DATE
rm -rf $BACKUP_DIR/$DATE

# Garder seulement les 7 dernières sauvegardes
ls -t $BACKUP_DIR/*.tar.gz | tail -n +8 | xargs rm -f
```

**Créer une tâche cron:**
```bash
sudo crontab -e

# Sauvegarde quotidienne à 2h du matin
0 2 * * * /usr/local/bin/backup-idees.sh
```

**Restauration:**
```bash
mongorestore --db idees_ensemble /backup/20231215/idees_ensemble
```

### Mise à jour de l'Application

```bash
# Backend
cd backend
git pull
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart idees-backend

# Frontend
cd ../frontend
git pull
yarn install
yarn build
sudo systemctl reload nginx
```

### Logs

**Backend:**
```bash
# Systemd
sudo journalctl -u idees-backend -f

# Logs applicatifs
tail -f /var/log/idees/backend.log
```

**Frontend/Nginx:**
```bash
tail -f /var/log/nginx/idees-access.log
tail -f /var/log/nginx/idees-error.log
```

### Monitoring

**Vérifier les services:**
```bash
sudo systemctl status idees-backend
sudo systemctl status nginx
sudo systemctl status mongod
```

**Utilisation des ressources:**
```bash
htop
df -h
free -m
```

---

## 🐛 Troubleshooting

### Backend ne démarre pas

**Vérifier les logs:**
```bash
sudo journalctl -u idees-backend -n 50
```

**Problèmes courants:**

1. **Port 8001 déjà utilisé:**
```bash
sudo lsof -i :8001
sudo kill -9 [PID]
```

2. **MongoDB non accessible:**
```bash
sudo systemctl status mongod
sudo systemctl restart mongod
```

3. **Dépendances manquantes:**
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### Frontend affiche une page blanche

1. **Vérifier la compilation:**
```bash
cd frontend
yarn build
```

2. **Vérifier la configuration Nginx:**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

3. **Vérifier les logs navigateur:**
Ouvrir la console développeur (F12) et chercher les erreurs

### Erreurs de connexion API

1. **Vérifier CORS:**
```bash
# backend/.env
CORS_ORIGINS=https://votre-domaine.com
```

2. **Vérifier le proxy Nginx:**
```bash
sudo nano /etc/nginx/sites-available/idees-ensemble
# Vérifier la section location /api
```

3. **Tester l'API directement:**
```bash
curl http://localhost:8001/api/stats
```

### Upload de fichiers échoue

1. **Vérifier les permissions:**
```bash
sudo chown -R idees:idees /home/idees/plateforme-participative/backend/uploads
sudo chmod -R 755 /home/idees/plateforme-participative/backend/uploads
```

2. **Vérifier l'espace disque:**
```bash
df -h
```

3. **Vérifier la limite Nginx:**
```bash
sudo nano /etc/nginx/nginx.conf
# Ajouter: client_max_body_size 10M;
```

### Base de données corrompue

**Réparer MongoDB:**
```bash
sudo systemctl stop mongod
sudo -u mongodb mongod --repair --dbpath /var/lib/mongodb
sudo systemctl start mongod
```


## 📄 Licence

MIT License - Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👥 Contribution

Les contributions sont les bienvenues ! Consultez [CONTRIBUTING.md](CONTRIBUTING.md) pour les guidelines.

---

**Développé avec ❤️ pour une démocratie participative plus accessible**

