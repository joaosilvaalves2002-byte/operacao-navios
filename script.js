let etapaAtual = 1;

// =========================
// NAVEGAÇÃO
// =========================

function mostrarTela(tela){

    document.getElementById("dashboard").classList.add("oculto");
    document.getElementById("navios").classList.add("oculto");
    document.getElementById("caminhoes").classList.add("oculto");
    document.getElementById("patrimonial").classList.add("oculto");
    document.getElementById("sst").classList.add("oculto");
    document.getElementById("riscos").classList.add("oculto");
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

}

function carregarNavios(){

    let navios =
    JSON.parse(localStorage.getItem("navios") || "[]");

    let tabela =
    document.getElementById("listaNavios");

    if(!tabela) return;

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
// CAMINHÕES
// =========================

function salvarCaminhao(){

    let placa =
    document.getElementById("placa").value;

    let motorista =
    document.getElementById("motorista").value;

    let transportadora =
    document.getElementById("transportadora").value;

    if(placa === ""){
        alert("Informe a placa.");
        return;
    }

    let caminhoes =
    JSON.parse(
    localStorage.getItem("caminhoes") || "[]");

    caminhoes.push({

        placa,
        motorista,
        transportadora

    });

    localStorage.setItem(
    "caminhoes",
    JSON.stringify(caminhoes)
    );

    carregarCaminhoes();

    document.getElementById("placa").value="";
    document.getElementById("motorista").value="";
    document.getElementById("transportadora").value="";

}

function carregarCaminhoes(){

    let caminhoes =
    JSON.parse(
    localStorage.getItem("caminhoes") || "[]");

    let tabela =
    document.getElementById("listaCaminhoes");

    if(!tabela) return;

    tabela.innerHTML="";

    caminhoes.forEach(item=>{

        tabela.innerHTML += `
        <tr>
            <td>${item.placa}</td>
            <td>${item.motorista}</td>
            <td>${item.transportadora}</td>
        </tr>
        `;

    });

}

// =========================
// FLUXO OPERACIONAL
// =========================

function avancarEtapa(){

    if(etapaAtual <= 14){

        let etapa =
        document.getElementById("e"+etapaAtual);

        if(etapa){
            etapa.classList.add("concluida");
        }

        etapaAtual++;

        document.getElementById("totalEtapas")
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

        data:new Date().toLocaleString(),

        descricao

    });

    localStorage.setItem(
    "ocorrencias",
    JSON.stringify(ocorrencias)
    );

    document.getElementById("descricao").value="";

    carregarOcorrencias();

}

function carregarOcorrencias(){

    let ocorrencias =
    JSON.parse(
    localStorage.getItem("ocorrencias") || "[]"
    );

    let tabela =
    document.getElementById("listaOcorrencias");

    if(!tabela) return;

    tabela.innerHTML="";

    ocorrencias.forEach(item=>{

        tabela.innerHTML += `
        <tr>
            <td>${item.data}</td>
            <td>${item.descricao}</td>
        </tr>
        `;

    });

    document.getElementById("totalOcorrencias")
    .innerText = ocorrencias.length;

}

// =========================
// NOTIFY / DAMAGE
// =========================

function registrarRisco(){

    let riscos =
    JSON.parse(
    localStorage.getItem("riscos") || "[]"
    );

    riscos.push({

        data:new Date().toLocaleString(),

        tipo:
        document.getElementById("tipoRisco").value,

        descricao:
        document.getElementById("descricaoRisco").value

    });

    localStorage.setItem(
    "riscos",
    JSON.stringify(riscos)
    );

    carregarRiscos();

    document.getElementById("descricaoRisco").value="";

}

function carregarRiscos(){

    let riscos =
    JSON.parse(
    localStorage.getItem("riscos") || "[]"
    );

    let tabela =
    document.getElementById("listaRiscos");

    if(!tabela) return;

    tabela.innerHTML="";

    riscos.forEach(item=>{

        tabela.innerHTML += `
        <tr>
            <td>${item.data}</td>
            <td>${item.tipo}</td>
            <td>${item.descricao}</td>
        </tr>
        `;

    });

}

// =========================
// INICIALIZAÇÃO
// =========================

carregarNavios();
carregarOcorrencias();
carregarCaminhoes();
carregarRiscos();
