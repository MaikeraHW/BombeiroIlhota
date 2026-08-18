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
   REGRAS DO RIO DCSC-00163
===================================================== */

const REGRA_RIO_00163 = {

    normal: 0.85,
    atencao: 1.50,
    prontidao: 2.99

};


/* =====================================================
   ATUALIZA STATUS DO RIO 00030
===================================================== */

function atualizarStatusRio00030(nivel) {

    const status = document.querySelector(
        '[data-rio="DCSC-00030"] .riverStatus'
    );

    if (!status) return;


    status.classList.remove(
        "statusNormal",
        "statusConcern",
        "statusProntidao",
        "statusAlert"
    );


    if (nivel < REGRA_RIO_00030.normal) {

        status.textContent = "NORMAL";
        status.classList.add("statusNormal");

    }

    else if (nivel < REGRA_RIO_00030.atencao) {

        status.textContent = "ATENÇÃO";
        status.classList.add("statusConcern");

    }

    else if (nivel <= REGRA_RIO_00030.prontidao) {

        status.textContent = "PRONTIDÃO";
        status.classList.add("statusProntidao");

    }

    else {

        status.textContent = "EMERGÊNCIA";
        status.classList.add("statusAlert");

    }

}


/* =====================================================
   ATUALIZA STATUS DO RIO 00163
===================================================== */

function atualizarStatusRio00163(nivel) {

    const status = document.querySelector(
        '[data-rio="DCSC-00163"] .riverStatus'
    );

    if (!status) return;


    status.classList.remove(
        "statusNormal",
        "statusConcern",
        "statusProntidao",
        "statusAlert"
    );


    if (nivel <= REGRA_RIO_00163.normal) {

        status.textContent = "NORMAL";
        status.classList.add("statusNormal");

    }

    else if (nivel <= REGRA_RIO_00163.atencao) {

        status.textContent = "ATENÇÃO";
        status.classList.add("statusConcern");

    }

    else if (nivel <= REGRA_RIO_00163.prontidao) {

        status.textContent = "PRONTIDÃO";
        status.classList.add("statusProntidao");

    }

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
           LOCALIZA OS DOIS RIOS
        ================================================= */

        const rio00030 = estacoes.find(
            e => e.codigo === "DCSC-00030"
        );

        const rio00163 = estacoes.find(
            e => e.codigo === "DCSC-00163"
        );


        /* =================================================
           VERIFICA RIO 00030
        ================================================= */

        if (!rio00030) {

            console.error(
                "Estação DCSC-00030 não encontrada."
            );

        }


        /* =================================================
           VERIFICA RIO 00163
        ================================================= */

        if (!rio00163) {

            console.error(
                "Estação DCSC-00163 não encontrada."
            );

        }


        /* =================================================
           RIO DCSC-00030
        ================================================= */

        if (rio00030) {

            const nivel00030 =
                rio00030.data.rio.rio_nivel.value;


            /* Nome */

            const nome00030 =
                document.getElementById("nome-00030");

            if (nome00030) {

                nome00030.textContent =
                    "Itajaí-açu";

            }


            /* Nível */

            const nivelElemento00030 =
                document.getElementById("nivel-00030");

            if (nivelElemento00030) {

                nivelElemento00030.textContent =
                    nivel00030
                        .toFixed(2)
                        .replace(".", ",");

            }


            /* Status */

            atualizarStatusRio00030(
                nivel00030
            );


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

        }


        /* =================================================
           RIO DCSC-00163
        ================================================= */

        if (rio00163) {

            const nivel00163 =
                rio00163.data.rio.rio_nivel.value;


            /* Nome */

            const nome00163 =
                document.getElementById("nome-00163");

            if (nome00163) {

                nome00163.textContent =
                    "Itajaí-Mirim";

            }


            /* Nível */

            const nivelElemento00163 =
                document.getElementById("nivel-00163");

            if (nivelElemento00163) {

                nivelElemento00163.textContent =
                    nivel00163
                        .toFixed(2)
                        .replace(".", ",");

            }


            /* Status */

            atualizarStatusRio00163(
                nivel00163
            );


            console.log(
                new Date().toLocaleString(),
                "DCSC-00163:",
                nivel00163,
                "Status:",
                nivel00163 <= 1.00
                    ? "NORMAL"
                    : nivel00163 <= 1.50
                        ? "ATENÇÃO"
                        : nivel00163 <= 2.00
                            ? "PRONTIDÃO"
                            : "EMERGÊNCIA"
            );

        }


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