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

---

## 📞 Support

Pour toute question ou problème:
- 📧 Email: support@idees-ensemble.com
- 🐛 Issues: https://github.com/votre-repo/plateforme-participative/issues
- 📖 Documentation: https://docs.idees-ensemble.com

---

## 📄 Licence

MIT License - Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👥 Contribution

Les contributions sont les bienvenues ! Consultez [CONTRIBUTING.md](CONTRIBUTING.md) pour les guidelines.

---

**Développé avec ❤️ pour une démocratie participative plus accessible**

