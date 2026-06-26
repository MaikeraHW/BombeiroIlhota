const form = document.getElementById("occurrenceForm");
const modal = document.getElementById("successModal");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");

form.addEventListener("submit", async function(e){

    e.preventDefault();

    const formData = new FormData(form);

    try{

        const response = await fetch(form.action,{
            method:"POST",
            body:formData
        });

        const data = await response.json();

        if(data.success){

            modalTitle.innerHTML = "Ocorrência enviada!";
            modalTitle.className = "success";

            modalMessage.innerHTML =
                "A ocorrência foi enviada com sucesso.";

            form.reset();

        }else{

            modalTitle.innerHTML = "Erro";
            modalTitle.className = "error";

            modalMessage.innerHTML = data.message;

        }

    }catch(error){

        modalTitle.innerHTML = "Erro";
        modalTitle.className = "error";

        modalMessage.innerHTML =
            "Não foi possível enviar a ocorrência. Tente novamente.";

    }

    modal.classList.remove("hidden");

});

function closeModal(){

    modal.classList.add("hidden");

}