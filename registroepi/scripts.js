const form = document.getElementById("epiForm");
const steps = document.querySelectorAll(".step");
const nextButtons = document.querySelectorAll(".next");
const prevButtons = document.querySelectorAll(".prev");
const progressBar = document.getElementById("progressBar");

const successScreen = document.getElementById("successScreen");
const newRecordBtn = document.getElementById("newRecordBtn");

const conditionSelect = document.getElementById("conditionSelect");
const observacaoField = document.getElementById("observacaoField");

const signatureScreen = document.getElementById("signatureScreen");
const openSignatureBtn = document.getElementById("openSignature");
const cancelSignatureBtn = document.getElementById("cancelSignature");
const clearSignatureBtn = document.getElementById("clearSignature");
const saveSignatureBtn = document.getElementById("saveSignature");

const canvas = document.getElementById("signatureCanvas");
const ctx = canvas.getContext("2d");

let currentStep = 0;
let drawing = false;
let hasSignature = false;

// =======================================
// CONTROLE DE ETAPAS
// =======================================
function showStep(index) {
    steps.forEach((step, i) => {
        step.classList.toggle("active", i === index);
    });

    const progress = ((index + 1) / steps.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function validateCurrentStep() {
    const activeStep = steps[currentStep];
    const fields = activeStep.querySelectorAll("input, select, textarea");

    for (const field of fields) {
        // Se observação estiver escondida e não for obrigatória, ignora
        if (field === observacaoField && conditionSelect.value !== "Não") {
            continue;
        }

        if (!field.checkValidity()) {
            field.reportValidity();
            return false;
        }
    }

    return true;
}

nextButtons.forEach(button => {
    button.addEventListener("click", () => {
        if (!validateCurrentStep()) return;

        if (currentStep < steps.length - 1) {
            currentStep++;
            showStep(currentStep);
        }
    });
});

prevButtons.forEach(button => {
    button.addEventListener("click", () => {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    });
});

// =======================================
// CAMPO DE OBSERVAÇÃO
// =======================================
function updateObservacaoField() {
    if (conditionSelect.value === "Não") {
        observacaoField.style.display = "block";
        observacaoField.required = true;
    } else {
        observacaoField.style.display = "none";
        observacaoField.required = false;
        observacaoField.value = "";
    }
}

conditionSelect.addEventListener("change", updateObservacaoField);
updateObservacaoField();

// =======================================
// ASSINATURA
// =======================================
function resizeCanvas() {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);

    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#000";
}

function getPosition(event) {
    const rect = canvas.getBoundingClientRect();

    if (event.touches && event.touches.length > 0) {
        return {
            x: event.touches[0].clientX - rect.left,
            y: event.touches[0].clientY - rect.top
        };
    }

    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function startDrawing(event) {
    drawing = true;
    hasSignature = true;

    const pos = getPosition(event);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);

    event.preventDefault();
}

function draw(event) {
    if (!drawing) return;

    const pos = getPosition(event);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    event.preventDefault();
}

function stopDrawing() {
    drawing = false;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasSignature = false;
}

// Mouse
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);

// Touch
canvas.addEventListener("touchstart", startDrawing, { passive: false });
canvas.addEventListener("touchmove", draw, { passive: false });
canvas.addEventListener("touchend", stopDrawing);
canvas.addEventListener("touchcancel", stopDrawing);

// =======================================
// ABRIR TELA DE ASSINATURA
// =======================================
openSignatureBtn.addEventListener("click", () => {
    if (!validateCurrentStep()) return;

    signatureScreen.classList.add("active");

    setTimeout(() => {
        resizeCanvas();
    }, 50);
});

cancelSignatureBtn.addEventListener("click", () => {
    signatureScreen.classList.remove("active");
});

clearSignatureBtn.addEventListener("click", clearCanvas);

// =======================================
// ENVIO DO FORM + ASSINATURA
// =======================================
saveSignatureBtn.addEventListener("click", async () => {
    if (!hasSignature) {
        alert("Por favor, faça a assinatura antes de finalizar.");
        return;
    }

    try {
        saveSignatureBtn.disabled = true;
        saveSignatureBtn.textContent = "Enviando...";

        const formData = new FormData(form);
        const signatureBase64 = canvas.toDataURL("image/png");
        formData.append("signature", signatureBase64);

        const response = await fetch("salvar_epi.php", {
            method: "POST",
            body: formData
        });

        console.log("STATUS HTTP:", response.status);
        console.log("OK?:", response.ok);

        const rawText = await response.text();
        console.log("RESPOSTA BRUTA DO PHP:", rawText);

        const data = JSON.parse(rawText);

        if (data.success) {

            // esconde form e assinatura
            form.style.display = "none";
            signatureScreen.classList.remove("active");

            // mostra sucesso
            successScreen.classList.add("show");

            // opcional: resetar progresso
            progressBar.style.width = "100%";
        } else {
            alert(data.message || "Erro ao salvar");
        }

    } catch (error) {
        console.error("ERRO NO ENVIO:", error);
        alert(error.message);
    } finally {
        saveSignatureBtn.disabled = false;
        saveSignatureBtn.textContent = "Confirmar assinatura";
    }
});

// =======================================
// NOVO REGISTRO
// =======================================
newRecordBtn.addEventListener("click", () => {
    form.reset();
    clearCanvas();
    updateObservacaoField();

    currentStep = 0;
    showStep(currentStep);

    successScreen.classList.remove("show");
    form.style.display = "block";
});

// Inicialização
window.addEventListener("load", () => {
    showStep(currentStep);
    resizeCanvas();
});

window.addEventListener("resize", () => {
    if (signatureScreen.classList.contains("active")) {
        resizeCanvas();
    }
});