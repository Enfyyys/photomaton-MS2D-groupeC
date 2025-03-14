const imageList = document.getElementById("image-list");
const imagePreview = document.getElementById("image-preview");

// Charger les images depuis le serveur
async function loadImages() {
    try {
        const response = await fetch("http://192.168.20.141:3000/images");
        const images = await response.json();

        imageList.innerHTML = ""; // Effacer la liste existante
        images.forEach(img => {
            const listItem = document.createElement("li");

            // Formater la date
            const date = new Date(img.created_at);
            const formattedDate = date.toLocaleString("fr-FR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            });

            listItem.innerHTML = `
                <a href="#" onclick="showImage('${img.url}')">${img.url}</a>
                <br><small>📅 ${formattedDate}</small>
            `;
            imageList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Erreur chargement des images:", error);
    }
}


// Afficher une image dans l'aperçu
function showImage(imageUrl) {
    imagePreview.src = `http://192.168.20.141:3000/saved_images/${imageUrl}`;
}

// Imprimer l'image sélectionnée
function printImage() {
    if (!imagePreview.src || imagePreview.src.includes("Sélectionnez")) {
        alert("Aucune image sélectionnée !");
        return;
    }

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`<img src="${imagePreview.src}" style="width:100%">`);
    printWindow.document.close();
    printWindow.print();
}

// Simuler l'envoi par email (à remplacer par une vraie requête backend)
function sendByEmail() {
    if (!imagePreview.src || imagePreview.src.includes("Sélectionnez")) {
        alert("Aucune image sélectionnée !");
        return;
    }

    alert("📧 Fonction d'envoi d'email à implémenter !");
}

// Charger la liste des images au démarrage
loadImages();
