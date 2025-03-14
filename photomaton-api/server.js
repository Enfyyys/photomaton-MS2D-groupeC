const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Création du dossier `saved_images/` s'il n'existe pas
const localSavePath = path.join(__dirname, "saved_images");
if (!fs.existsSync(localSavePath)) {
    fs.mkdirSync(localSavePath, { recursive: true });
}

// Configuration CORS
app.use(cors());
app.use(express.json());

// ✅ Servir le menu principal AVANT les autres fichiers statiques
app.use(express.static(path.join(__dirname, "photomaton-front/photomaton-menu")));

// ✅ Servir les autres applications (photo, impression)
app.use(express.static(path.join(__dirname, "photomaton-front/photomaton-photo")));
app.use(express.static(path.join(__dirname, "photomaton-front/photomaton-imprimer")));

// ✅ Servir les images stockées localement
app.use("/saved_images", express.static(localSavePath));

// Configuration Multer (stockage temporaire)
const upload = multer({ dest: "uploads/" });

// 📸 Route pour récupérer l'ID de la dernière image locale
app.get("/last-image-id", async (req, res) => {
    try {
        const files = fs.readdirSync(localSavePath).filter(file => file.endsWith(".png"));
        
        if (files.length === 0) {
            return res.json({ nextId: 1 }); // Aucune image encore enregistrée
        }

        // Trier les fichiers par date décroissante
        files.sort((a, b) => fs.statSync(path.join(localSavePath, b)).mtimeMs - fs.statSync(path.join(localSavePath, a)).mtimeMs);

        const lastFile = files[0];
        const lastId = parseInt(lastFile.split("-").pop().split(".")[0], 10) || 0;
        const nextId = lastId + 1;

        res.json({ nextId });
    } catch (error) {
        console.error("❌ Erreur récupération du dernier ID :", error);
        res.status(500).json({ error: "Échec de récupération du dernier ID" });
    }
});

// 📤 Route pour uploader une image (et sauvegarde locale)
app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Aucun fichier à télécharger" });
        }

        const title = req.body.title || `image-${Date.now()}`;
        const localFilePath = path.join(localSavePath, `${title}.png`);

        // Sauvegarde en local
        fs.copyFileSync(req.file.path, localFilePath);
        console.log(`📂 Image sauvegardée localement : ${localFilePath}`);

        // Suppression du fichier temporaire
        fs.unlinkSync(req.file.path);

        res.json({
            message: "Image envoyée avec succès",
            localPath: localFilePath,
        });
    } catch (error) {
        console.error("❌ Erreur upload :", error);
        res.status(500).json({ error: "Échec de l'upload" });
    }
});

// 🖼 Route pour récupérer les images locales
app.get("/images", async (req, res) => {
    try {
        const files = fs.readdirSync(localSavePath);

        const images = files.map(file => {
            const filePath = path.join(localSavePath, file);
            const stats = fs.statSync(filePath);
            
            return {
                url: `/saved_images/${file}`,
                created_at: stats.mtime.toISOString()
            };
        });

        // Trier par date décroissante
        images.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        res.json(images);
    } catch (error) {
        console.error("❌ Erreur récupération images:", error);
        res.status(500).json({ error: "Erreur récupération des images" });
    }
});

// 🖼 Route pour afficher la liste des fichiers dans "saved_images"
app.get("/saved_images", (req, res) => {
    fs.readdir(localSavePath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: "Erreur de lecture du dossier" });
        }
        
        const imageLinks = files
            .filter(file => file.endsWith(".png")) 
            .map(file => `<li><a href="/saved_images/${file}">${file}</a></li>`)
            .join("");

        res.send(`<h1>Images enregistrées</h1><ul>${imageLinks}</ul>`);
    });
});

// 🖥 Démarrage du serveur
app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Serveur démarré sur http://192.168.20.141:${port}/`);
});
