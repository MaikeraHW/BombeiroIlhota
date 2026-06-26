document.addEventListener("DOMContentLoaded", async () => {

    // BOTÃO COPIAR PIX
    const copyBtn = document.getElementById("copyBtn");

    if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(codigoPix);
        } catch (err) {
            console.error("Erro ao copiar:", err);
        }
    });
}})

const codigoPix = `00020101021126980014br.gov.bcb.pix01362be2e93c-ba13-4801-a20e-7ae2a13fa1c30236A sua doacao salva vidas. Obrigado! 5204000053039865802BR5925BOMBEIROS VOLUNTARIOS DE 6009SAO PAULO62290525XvQjTo5C0we4kt9ayaxqhVQtN63043994`;
