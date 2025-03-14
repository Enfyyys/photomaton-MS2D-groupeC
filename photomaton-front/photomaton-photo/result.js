// Récupérer l'image stockée dans le localStorage
const photo = localStorage.getItem("previewPhoto");
const previewPhoto = document.getElementById("preview-photo");
previewPhoto.src = photo;

// Variables pour le filtre et le cadre
let currentFilter = 'none';
let currentFrame = 'none';

// Appliquer un filtre sur l'image
function applyFilter(filter) {
    currentFilter = filter;  // Mettre à jour le filtre actuel
    updatePreview();  // Mettre à jour l'image de prévisualisation
}

// Appliquer un cadre sur l'image
function applyFrame(frame) {
    currentFrame = frame;  // Mettre à jour le cadre actuel
    updatePreview();  // Mettre à jour l'image de prévisualisation
}

// Mettre à jour l'image de prévisualisation avec le filtre et le cadre
function updatePreview() {
    previewPhoto.style.filter = currentFilter;
    previewPhoto.style.border = currentFrame;
}

// Envoi de l'image vers Cloudinary
document.getElementById("upload-photo").addEventListener("click", async () => {
    if (!photo) {
        alert("Aucune photo à envoyer !");
        return;
    }

    // Créer un canvas pour appliquer le filtre et le cadre
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    canvas.width = previewPhoto.width;
    canvas.height = previewPhoto.height;

    // Dessiner l'image de prévisualisation sur le canvas
    ctx.drawImage(previewPhoto, 0, 0, canvas.width, canvas.height);

    // Appliquer le filtre
    ctx.filter = currentFilter;
    ctx.drawImage(previewPhoto, 0, 0, canvas.width, canvas.height); // Redessiner avec filtre

    // Appliquer le cadre
    if (currentFrame !== 'none') {
        ctx.lineWidth = 10;  // Épaisseur du cadre
        ctx.strokeStyle = currentFrame;  // Appliquer la couleur du cadre
        ctx.strokeRect(0, 0, canvas.width, canvas.height);  // Dessiner le cadre
    }

    // Convertir l'image modifiée du canvas en base64
    let modifiedImage = canvas.toDataURL("image/png");

    // Convertir l'image base64 en Blob
    let blob = await fetch(modifiedImage).then(res => res.blob()); // Convertir base64 en Blob

    // Récupérer l'ID de la dernière image depuis le serveur
    const response = await fetch("http://192.168.20.141:3000/last-image-id");
    const data = await response.json();
    const nextId = data.nextId;

    // FormData pour l'upload
    let formData = new FormData();
    formData.append("file", blob);
    formData.append("upload_preset", "mon_preset"); // Remplace par ton upload_preset

    const date = new Date(Date.now());
    const formattedDate = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}-${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
    formData.append("title", formattedDate + "-" + nextId);  // Utiliser l'ID incrémenté comme titre

    try {
        let response = await fetch("http://192.168.20.141:3000/upload", {
            method: "POST",
            body: formData
        });
        let data = await response.json();
        alert("Photo envoyée avec succès !");
    } catch (error) {
        alert("Erreur lors de l'envoi !");
        console.error(error);
    }
});
