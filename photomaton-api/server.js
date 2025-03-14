const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// 📂 Chemins absolus
const projectRoot = "/home/admin/photomaton/photomaton-MS2D-groupeC";
const frontPath = path.join(projectRoot, "photomaton-front");
const localSavePath = path.join(projectRoot, "saved_images");

// 📁 Vérifier et créer le dossier `saved_images` s'il n'existe pas
if (!fs.existsSync(localSavePath)) {
    fs.mkdirSync(localSavePath, { recursive: true });
}

// ✅ Configuration CORS et JSON
app.use(cors());
app.use(express.json());

// ✅ Servir les fichiers statiques des différentes applications
app.use(express.static(path.join(frontPath, "photomaton-menu")));
app.use(express.static(path.join(frontPath, "photomaton-photo")));
app.use(express.static(path.join(frontPath, "photomaton-imprimer")));

// ✅ Servir les images stockées localement
if (fs.existsSync(localSavePath)) {
    app.use("/saved_images", express.static(localSavePath));
} else {
    console.warn("⚠️ Dossier 'saved_images' introuvable !");
}

// 📸 Route pour récupérer l'ID de la dernière image locale
app.get("/last-image-id", async (req, res) => {
    try {
        const files = fs.readdirSync(localSavePath).filter(file => file.endsWith(".png"));
        const nextId = files.length ? parseInt(files[files.length - 1].split("-").pop().split(".")[0], 10) + 1 : 1;
        res.json({ nextId });
    } catch (error) {
        console.error("❌ Erreur récupération du dernier ID :", error);
        res.status(500).json({ error: "Échec de récupération du dernier ID" });
    }
});

// 📤 Route pour uploader une image
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "Aucun fichier reçu" });

        const title = req.body.title || `image-${Date.now()}`;
        const localFilePath = path.join(localSavePath, `${title}.png`);
        
        fs.copyFileSync(req.file.path, localFilePath);
        fs.unlinkSync(req.file.path);

        res.json({ message: "Image envoyée avec succès", localPath: `/saved_images/${title}.png` });
    } catch (error) {
        console.error("❌ Erreur upload :", error);
        res.status(500).json({ error: "Échec de l'upload" });
    }
});

// 🖼 Route pour récupérer les images locales
app.get("/images", async (req, res) => {
    try {
        const files = fs.readdirSync(localSavePath);
        const images = files
            .filter(file => file.endsWith(".png"))
            .map(file => ({ url: `/saved_images/${file}`, created_at: fs.statSync(path.join(localSavePath, file)).mtime.toISOString() }));

        res.json(images.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (error) {
        console.error("❌ Erreur récupération images:", error);
        res.status(500).json({ error: "Erreur récupération des images" });
    }
});

// 🖼 Route pour afficher la liste des fichiers dans "saved_images"
app.get("/saved_images", (req, res) => {
    fs.readdir(localSavePath, (err, files) => {
        if (err) return res.status(500).json({ error: "Erreur de lecture du dossier" });

        res.send(`
            <h1>Images enregistrées</h1>
            <ul>${files.filter(file => file.endsWith(".png")).map(file => `<li><a href="/saved_images/${file}">${file}</a></li>`).join("")}</ul>
        `);
    });
});

// 🏠 Route par défaut pour afficher un message clair
app.get("/", (req, res) => {
    res.send("<h1>🚀 Serveur Photomaton en ligne !</h1><p>Accédez à <a href='/menu.html'>menu.html</a></p>");
});

// 🖥 Démarrage du serveur
app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Serveur en ligne sur http://192.168.20.141:${port}/`);
});
