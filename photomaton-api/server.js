const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Configuration CORS pour accepter les requêtes distantes
app.use(cors());
app.use(express.json());

// 📂 Définition des chemins absolus pour ton frontend
const menuPath = path.join(__dirname, "photomaton-front/photomaton-menu");
const photoPath = path.join(__dirname, "photomaton-front/photomaton-photo");
const printPath = path.join(__dirname, "photomaton-front/photomaton-imprimer");

// 📂 Servir les applications frontend
app.use(express.static(menuPath));
app.use(express.static(photoPath));
app.use(express.static(printPath));

// 📂 Servir les images stockées localement
const localSavePath = path.join(__dirname, "saved_images");
if (!fs.existsSync(localSavePath)) {
    fs.mkdirSync(localSavePath, { recursive: true });
}
app.use("/saved_images", express.static(localSavePath));

// 📸 Route pour récupérer les images
app.get("/images", (req, res) => {
    try {
        const files = fs.readdirSync(localSavePath).filter(file => file.endsWith(".png"));
        const images = files.map(file => ({
            url: `/saved_images/${file}`,
            created_at: fs.statSync(path.join(localSavePath, file)).mtime.toISOString(),
        }));
        res.json(images);
    } catch (error) {
        console.error("Erreur récupération des images :", error);
        res.status(500).json({ error: "Erreur récupération des images" });
    }
});

// 📤 Route pour uploader une image
const upload = multer({ dest: "uploads/" });
app.post("/upload", upload.single("file"), (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "Aucun fichier reçu" });

        const filePath = path.join(localSavePath, `${Date.now()}.png`);
        fs.renameSync(req.file.path, filePath);

        res.json({ message: "Image sauvegardée", path: filePath });
    } catch (error) {
        console.error("Erreur upload :", error);
        res.status(500).json({ error: "Échec de l'upload" });
    }
});

// 🔥 Démarrer le serveur
app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Serveur en ligne : http://192.168.20.141:${port}/`);
});
