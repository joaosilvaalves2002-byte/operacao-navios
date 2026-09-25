let etapaAtual = 1;

// =========================
// NAVEGAÇÃO
// =========================

function mostrarTela(tela){

    document.getElementById("dashboard").classList.add("oculto");
    document.getElementById("navios").classList.add("oculto");
    document.getElementById("fluxo").classList.add("oculto");
    document.getElementById("ocorrencias").classList.add("oculto");

    document.getElementById(tela).classList.remove("oculto");

}

// =========================
// NAVIOS
// =========================

function salvarNavio(){

    let navio = document.getElementById("navio").value;
    let armador = document.getElementById("armador").value;
    let berco = document.getElementById("berco").value;
    let viagem = document.getElementById("viagem").value;
    let carga = document.getElementById("carga").value;

    if(navio === ""){
        alert("Informe o nome do navio.");
        return;
    }

    let navios =
    JSON.parse(localStorage.getItem("navios") || "[]");

    navios.push({
        navio,
        armador,
        berco,
        viagem,
        carga
    });

    localStorage.setItem(
        "navios",
        JSON.stringify(navios)
    );

    carregarNavios();

    document.getElementById("navio").value = "";
    document.getElementById("armador").value = "";
    document.getElementById("berco").value = "";
    document.getElementById("viagem").value = "";
    document.getElementById("carga").value = "";

    alert("Navio cadastrado com sucesso.");

}

function carregarNavios(){

    let navios =
    JSON.parse(localStorage.getItem("navios") || "[]");

    let tabela =
    document.getElementById("listaNavios");

    tabela.innerHTML = "";

    navios.forEach(item => {

        tabela.innerHTML += `
        <tr>
            <td>${item.navio}</td>
            <td>${item.armador}</td>
            <td>${item.berco}</td>
            <td>${item.viagem}</td>
            <td>${item.carga}</td>
        </tr>
        `;

    });

    document.getElementById("totalNavios").innerText =
    navios.length;

}

// =========================
// FLUXO OPERACIONAL
// =========================

function avancarEtapa(){

    if(etapaAtual <= 12){

        document
        .getElementById("e" + etapaAtual)
        .classList.add("concluida");

        etapaAtual++;

        document
        .getElementById("totalEtapas")
        .innerText = etapaAtual - 1;

    }

}

// =========================
// OCORRÊNCIAS
// =========================

function registrarOcorrencia(){

    let descricao =
    document.getElementById("descricao").value;

    if(descricao === ""){
        alert("Informe uma ocorrência.");
        return;
    }

    let ocorrencias =
    JSON.parse(
        localStorage.getItem("ocorrencias") || "[]"
    );

    ocorrencias.push({

        data: new Date().toLocaleString(),

        descricao: descricao

    });

    localStorage.setItem(
        "ocorrencias",
        JSON.stringify(ocorrencias)
    );

    document.getElementById("descricao").value = "";

    carregarOcorrencias();

}

function carregarOcorrencias(){

    let ocorrencias =
    JSON.parse(
        localStorage.getItem("ocorrencias") || "[]"
    );

    let tabela =
    document.getElementById("listaOcorrencias");

    tabela.innerHTML = "";

    ocorrencias.forEach(item => {

        tabela.innerHTML += `
        <tr>
            <td>${item.data}</td>
            <td>${item.descricao}</td>
        </tr>
        `;

    });

    document.getElementById("totalOcorrencias").innerText =
    ocorrencias.length;

}

// =========================
// INICIALIZAÇÃO
// =========================

carregarNavios();
carregarOcorrencias();
