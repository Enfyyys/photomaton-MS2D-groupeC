const { execSync } = require("child_process");

try {
    console.log("🚀 Installation et configuration de PM2...");

    // Vérifie si PM2 est installé, sinon l'installe globalement
    execSync("npm install -g pm2", { stdio: "inherit" });

    // Démarre l'application avec PM2
    execSync("pm2 start server.js --name photomaton", { stdio: "inherit" });

    // Sauvegarde le processus pour qu'il redémarre après reboot
    execSync("pm2 save", { stdio: "inherit" });

    // Configure PM2 pour démarrer au boot, quel que soit l'OS
    execSync("pm2 startup", { stdio: "inherit" });

    console.log("✅ PM2 est maintenant configuré pour démarrer au boot !");
} catch (error) {
    console.error("❌ Une erreur est survenue :", error);
}
