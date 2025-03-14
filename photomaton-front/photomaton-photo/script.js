// Récupération des éléments
const video = document.getElementById("camera-feed");
const countdown = document.getElementById("countdown");
const takePhotoBtn = document.getElementById("take-photo");

// Accéder à la webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(error => {
        console.error("Erreur d'accès à la caméra :", error);
    });

// 🎵 Chargement des sons
const countdownSound = new Audio("sounds/clic.wav");
const cameraSound = new Audio("sounds/camera_shutter.wav");
const popSound = new Audio("sounds/party_trumpet.wav");

// Fonction pour démarrer le compte à rebours et capturer l'image
function startCountdown() {
    let count = 3;
    countdown.textContent = count;
    countdown.classList.add("shake"); // Ajoute l'effet de tremblement

    let interval = setInterval(() => {
        if (count > 0) {
            countdownSound.play(); // 🔊 Joue le bip du compte à rebours
            countdown.textContent = count;
        } else if (count == 0) {
            countdown.textContent = "Cheeeese ! 😁";
        } else {
            clearInterval(interval);
            countdown.textContent = "";
            countdown.classList.remove("shake");
            capturePhoto();
        }
        count--;
    }, 1000);

    // 🎉 Effet de zoom sur le bouton
    takePhotoBtn.classList.add("clicked");
    setTimeout(() => {
        takePhotoBtn.classList.remove("clicked");
    }, 300);
}


// Fonction pour capturer la photo
function capturePhoto() {
    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    let photoData = canvas.toDataURL("image/png");
    localStorage.setItem("previewPhoto", photoData);

    cameraSound.play(); // 🔊 Son de l’appareil photo
    launchConfetti(); // 🎊 Ajouter des confettis

    // Redirection après une petite animation
    setTimeout(() => {
        window.location.href = "result.html";
    }, 1500);
}

// 🎉 Fonction pour générer des confettis
function launchConfetti() {
    for (let i = 0; i < 50; i++) {
        let confetti = document.createElement("div");
        confetti.className = "confetti";
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.animationDuration = Math.random() * 2 + 3 + "s";
        document.body.appendChild(confetti);

        popSound.play(); // 🔊 Petit son de pop à chaque confetti

        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Déclenchement de la capture au clic
takePhotoBtn.addEventListener("click", startCountdown);
