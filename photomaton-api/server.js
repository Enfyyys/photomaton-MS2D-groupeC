const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;

// 📂 Définition du bon chemin absolu pour le menu
const menuPath = "/home/admin/photomaton/photomaton-MS2D-groupeC/photomaton-front/photomaton-menu";

// 🔹 Vérifier si le dossier existe
if (!fs.existsSync(menuPath)) {
    console.error("❌ ERREUR: Le dossier photomaton-menu est introuvable !");
    process.exit(1);
}

// ✅ Servir le menu principal
app.use(express.static(menuPath));

// 🏠 Route par défaut pour tester si le serveur tourne
app.get("/", (req, res) => {
    res.send("<h1>🚀 Serveur Photomaton en ligne !</h1><p>Accédez à <a href='/menu.html'>menu.html</a></p>");
});

// 🖥 Démarrage du serveur
app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Serveur en ligne sur http://192.168.20.141:${port}/`);
});
