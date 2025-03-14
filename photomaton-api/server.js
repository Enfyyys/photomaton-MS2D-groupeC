const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// 📂 Création du dossier `saved_images/` s'il n'existe pas
const localSavePath = path.join(__dirname, "saved_images");
if (!fs.existsSync(localSavePath)) {
    fs.mkdirSync(localSavePath, { recursive: true });
}

// ✅ Configuration CORS (permet les accès distants)
app.use(cors());
app.use(express.json());

// ✅ Servir le menu principal
app.use(express.static(path.join(__dirname, "photomaton-front/photomaton-menu")));

// ✅ Servir les autres applications
app.use("/photomaton-photo", express.static(path.join(__dirname, "photomaton-front/photomaton-photo")));
app.use("/photomaton-imprimer", express.static(path.join(__dirname, "photomaton-front/photomaton-imprimer")));

// ✅ Servir les images stockées localement
app.use("/saved_images", express.static(localSavePath));

// 📸 Configuration Multer (pour upload des photos)
const upload = multer({ dest: "uploads/" });

// 📸 Route pour prendre une photo et la sauvegarder
app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Aucun fichier reçu" });
        }

        const fileName = `image-${Date.now()}.png`;
        const localFilePath = path.join(localSavePath, fileName);

        // Copier le fichier dans le dossier des images sauvegardées
        fs.copyFileSync(req.file.path, localFilePath);
        fs.unlinkSync(req.file.path); // Supprimer le fichier temporaire

        console.log(`📂 Image sauvegardée : ${localFilePath}`);

        res.json({ message: "Image envoyée avec succès", filename: fileName });
    } catch (error) {
        console.error("❌ Erreur upload :", error);
        res.status(500).json({ error: "Erreur lors de l'upload" });
    }
});

// 🖼 Route pour récupérer la liste des images enregistrées
app.get("/images", async (req, res) => {
    try {
        const files = fs.readdirSync(localSavePath).filter(file => file.endsWith(".png"));
        const images = files.map(file => ({ url: `/saved_images/${file}` }));

        res.json(images);
    } catch (error) {
        console.error("❌ Erreur récupération images:", error);
        res.status(500).json({ error: "Erreur récupération des images" });
    }
});

// 🖥 Page d'accueil serveur
app.get("/", (req, res) => {
    res.send("<h1>🚀 Serveur Photomaton en ligne !</h1><p>Accédez à <a href='/menu.html'>menu.html</a></p>");
});

// 🖥 Démarrage du serveur
app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Serveur démarré sur http://192.168.20.141:${port}/`);
});
