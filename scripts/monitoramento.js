const GRAPHQL_URL = "https://monitoramento.defesacivil.sc.gov.br/graphql";

const QUERY = `
  query Tags_data {
    tags_data(clients: ["secretaria-de-defesa-civil"]) {
      qualle_meteorologia {
        codigo
        name {
          general
        }
        data {
          rio {
            rio_nome {
              value
            }
            rio_nivel {
              value
              show {
                value
              }
            }
          }
        }
      }
    }
  }
`;


/* =====================================================
   REGRAS DO RIO DCSC-00030
===================================================== */

const REGRA_RIO_00030 = {

    normal: 9.20,
    atencao: 10.00,
    prontidao: 10.50

};


/* =====================================================
   ATUALIZA STATUS DO RIO
===================================================== */

function atualizarStatusRio00030(nivel) {

    const status = document.querySelector(
        '[data-rio="DCSC-00030"] .riverStatus'
    );

    if (!status) return;


    // Remove o status anterior
    status.classList.remove(
        "statusNormal",
        "statusConcern",
        "statusProntidao",
        "statusAlert"
    );


    /* =========================
       NORMAL
    ========================= */

    if (nivel < REGRA_RIO_00030.normal) {

        status.textContent = "NORMAL";
        status.classList.add("statusNormal");

    }


    /* =========================
       ATENÇÃO
    ========================= */

    else if (nivel < REGRA_RIO_00030.atencao) {

        status.textContent = "ATENÇÃO";
        status.classList.add("statusConcern");

    }


    /* =========================
       PRONTIDÃO
    ========================= */

    else if (nivel <= REGRA_RIO_00030.prontidao) {

        status.textContent = "PRONTIDÃO";
        status.classList.add("statusProntidao");

    }


    /* =========================
       EMERGÊNCIA
    ========================= */

    else {

        status.textContent = "EMERGÊNCIA";
        status.classList.add("statusAlert");

    }

}


/* =====================================================
   BUSCA OS DADOS
===================================================== */

async function atualizarRios() {

    try {

        const resposta = await fetch(GRAPHQL_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                query: QUERY
            })
        });


        const resultado = await resposta.json();


        const estacoes =
            resultado.data.tags_data.qualle_meteorologia;


        /* =================================================
           RIO DCSC-00030
        ================================================= */

        const rio00030 = estacoes.find(
            e => e.codigo === "DCSC-00030"
        );


        if (!rio00030) {

            console.error(
                "Estação DCSC-00030 não encontrada."
            );

            return;
        }


        const nivel00030 =
            rio00030.data.rio.rio_nivel.value;


        /* =================================================
           ATUALIZA NOME
        ================================================= */

        const nome = document.getElementById(
            "nome-00030"
        );

        if (nome) {

            nome.textContent =
                "Itajaí-açu";

        }


        /* =================================================
           ATUALIZA NÍVEL
        ================================================= */

        const nivel = document.getElementById(
            "nivel-00030"
        );

        if (nivel) {

            nivel.textContent =
                nivel00030.toFixed(2).replace(".", ",");

        }


        /* =================================================
           ATUALIZA STATUS
        ================================================= */

        atualizarStatusRio00030(
            nivel00030
        );


        /* =================================================
           CONSOLE
        ================================================= */

        console.log(
            new Date().toLocaleString(),
            "DCSC-00030:",
            nivel00030,
            "Status:",
            nivel00030 < 9.20
                ? "NORMAL"
                : nivel00030 < 10.00
                    ? "ATENÇÃO"
                    : nivel00030 <= 10.50
                        ? "PRONTIDÃO"
                        : "EMERGÊNCIA"
        );


    } catch (erro) {

        console.error(
            "Erro ao buscar níveis:",
            erro
        );

    }

}


/* =====================================================
   PRIMEIRA CONSULTA
===================================================== */

atualizarRios();


/* =====================================================
   ATUALIZA A CADA 30 SEGUNDOS
===================================================== */

setInterval(
    atualizarRios,
    30000
);