# 📸 Photomaton - Monorepo

Bienvenue sur **Photomaton**, un projet regroupant plusieurs applications permettant la prise de photos, la gestion des images, et leur impression ou envoi par e-mail.

## 📁 Structure du projet

```
photomaton/
│── photomaton-api/      # Backend (Photomaton API)
│── photomaton-front/    # Application de capture photo
│   ├── photomaton-menu/       # Page d'accueil pour sélectionner l'application
│   ├── photomaton-imprimer/   # Application de gestion et impression des images
│   └── photomaton-photo/   # Application pour prendre les photos et les envoyer
│── README.md            # Documentation du projet
```

---

## 🚀 Fonctionnalités

### 1️⃣ API Backend (Dossier `photomaton-api/`)
- Fournit un serveur local sur le réseau local pour stocker et récupérer les images.
- Gestion des requêtes pour l'envoi d'e-mails avec des images.

### 2️⃣ Application de capture photo (Dossier `photomaton-front/photomaton-photo/`)
- Interface pour capturer des photos via webcam.
- Sauvegarde des images et affichage du compte à rebours.

### 3️⃣ Application de gestion & impression (Dossier `photomaton-front/photomaton-imprimer/`)
- Liste des images enregistrées.
- Aperçu des photos avec options d'impression et d'envoi par e-mail.

### 4️⃣ Menu principal (Dossier `photomaton-menu/`)
- Interface permettant de choisir entre l'application de capture ou de gestion des images.
- Redirection automatique si un choix est déjà fait.

---

## 🛠️ Installation & Lancement

### 📌 1. Cloner le projet
```bash
git clone https://github.com/Enfyyys/photomaton-MS2D-groupeC.git
cd photomaton-MS2D-groupeC
```

### 📌 2. Installer les dépendances
> ⚠️ Assurez-vous d'avoir **Node.js** et **npm** installés.
```bash
cd photomaton-api && npm install   # Installer les dépendances du backend
```

### 📌 3. Lancer l'API Backend
```bash
npm start
```

### 📌 4. Lancer les applications frontend
Ouvrir `menu.html` du dossier **`photomaton-menu/`** dans un navigateur.

---

## 📧 Fonctionnalité d'envoi d'e-mails
Si vous souhaitez activer l'envoi d'e-mails :
- Configurez les informations SMTP dans **`api/config.js`**
- Ajoutez une adresse e-mail d'envoi valide.

---

## 🌍 Déploiement
Si vous souhaitez déployer :
- **Backend** → Hébergement sur un serveur Node.js (ex: Heroku, Vercel, Render).
- **Frontend** → Hébergement statique (ex: GitHub Pages, Netlify).

---

## 👨‍💻 Contribution
1. Forkez le repo.
2. Créez une branche (`git checkout -b feature-ma-fonction`).
3. Commitez vos modifications (`git commit -m "Ajout de ma fonctionnalité"`).
4. Poussez (`git push origin feature-ma-fonction`).
5. Ouvrez une **Pull Request**.


---

💡 **Besoin d'aide ?** Ouvrez une issue ou contactez-nous ! 🚀

