// 🎥 Récupération des éléments
const video = document.getElementById("camera-feed");
const countdown = document.getElementById("countdown");
const takePhotoBtn = document.getElementById("take-photo");

// 🎵 Chargement des sons
const countdownSound = new Audio("sounds/click.mp3");
const cheeseSound = new Audio("sounds/camera-click.mp3");
const cameraSound = new Audio("sounds/aaa.mp3");
const popSound = new Audio("sounds/aaa.mp3");

// ✅ Accéder à la webcam avec meilleure compatibilité
navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(error => {
        console.error("❌ Erreur d'accès à la caméra :", error);
        alert("⚠️ Impossible d'accéder à la caméra. Vérifiez les permissions !");
    });

// 🎬 Fonction pour démarrer le compte à rebours et capturer l'image
function startCountdown() {
    let count = 3;
    countdown.textContent = count;
    countdown.classList.add("shake"); // Ajoute l'effet de tremblement

    let interval = setInterval(() => {
        if (count > 0) {
            countdownSound.play(); // 🔊 Bip du compte à rebours
            countdown.textContent = count;
        } else if (count === 0) {
            cheeseSound.play(); // 🔊 "Cheese!" juste avant la prise de photo
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

// 📸 Fonction pour capturer la photo
function capturePhoto() {
    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    let photoData = canvas.toDataURL("image/png");
    localStorage.setItem("previewPhoto", photoData);

    // 🔊 Jouer le son de l’appareil photo
    cameraSound.play();
    
    // 🎊 Lancer des confettis
    launchConfetti();

    // 🔄 Redirection vers la page de résultat après une animation
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

        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// 🖱️ Déclenchement de la capture au clic
takePhotoBtn.addEventListener("click", startCountdown);
