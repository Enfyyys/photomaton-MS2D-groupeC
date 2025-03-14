// Vérifie si un choix a déjà été fait et redirige automatiquement
window.onload = function() {
    const selectedApp = localStorage.getItem("selectedApp");
    if (selectedApp) {
        window.location.href = selectedApp === "photo" ? "../photomaton-dev/index.html" : "../photomaton-dev2/index.html";
    }
};

// Stocke le choix et redirige
function selectApp(app) {
    localStorage.setItem("selectedApp", app);
    window.location.href = app === "photo" ? "../photomaton-dev/index.html" : "../photomaton-dev2/index.html";
}
