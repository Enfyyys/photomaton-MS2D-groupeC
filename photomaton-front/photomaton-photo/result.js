// Récupérer l'image stockée dans le localStorage
const photo = localStorage.getItem("previewPhoto");
const previewPhoto = document.getElementById("preview-photo");

// Vérifier si l'image est disponible
if (photo) {
    previewPhoto.src = photo;
} else {
    previewPhoto.src = "placeholder.jpg"; // Image par défaut si aucune photo n'est trouvée
    alert("⚠️ Aucune photo trouvée ! Veuillez en prendre une nouvelle.");
}

// Variables pour le filtre
let currentFilter = 'none';

// Appliquer un filtre sur l'image
function applyFilter(filter) {
    currentFilter = filter;  // Mettre à jour le filtre actuel
    previewPhoto.style.filter = currentFilter; // Appliquer visuellement le filtre
}

// Envoi de l'image vers Cloudinary avec le filtre appliqué
document.getElementById("upload-photo").addEventListener("click", async () => {
    if (!photo) {
        alert("⚠️ Aucune photo à envoyer !");
        return;
    }

    try {
        // Créer un canvas pour appliquer le filtre
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        // Définir la taille du canvas en fonction de l'image originale
        let img = new Image();
        img.src = photo;

        img.onload = async function () {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;

            // Appliquer le filtre AVANT de dessiner l'image
            ctx.filter = currentFilter;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Convertir l'image modifiée du canvas en base64
            let modifiedImage = canvas.toDataURL("image/png");

            // Convertir l'image base64 en Blob
            let blob = await fetch(modifiedImage).then(res => res.blob());

            // Récupérer l'ID de la dernière image depuis le serveur
            const response = await fetch("http://192.168.20.141:3000/last-image-id");
            const data = await response.json();
            const nextId = data.nextId;

            // FormData pour l'upload
            let formData = new FormData();
            formData.append("file", blob);
            formData.append("upload_preset", "mon_preset"); // Remplace par ton preset Cloudinary
            formData.append("title", "image-" + nextId);  // Utiliser l'ID incrémenté comme titre

            // Envoi vers Cloudinary
            let uploadResponse = await fetch("http://192.168.20.141:3000/upload", {
                method: "POST",
                body: formData
            });

            let uploadData = await uploadResponse.json();
            alert("✅ Photo envoyée avec succès !");
        };
    } catch (error) {
        alert("❌ Erreur lors de l'envoi !");
        console.error(error);
    }
});
