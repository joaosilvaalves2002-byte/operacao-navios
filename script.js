let etapaAtual = 1;

function mostrarTela(tela){

document.getElementById("dashboard").classList.add("oculto");
document.getElementById("navios").classList.add("oculto");
document.getElementById("fluxo").classList.add("oculto");
document.getElementById("ocorrencias").classList.add("oculto");

document.getElementById(tela).classList.remove("oculto");

}

function salvarNavio(){

let navios =
JSON.parse(localStorage.getItem("navios") || "[]");

navios.push({

navio: document.getElementById("navio").value,
armador: document.getElementById("armador").value,
berco: document.getElementById("berco").value,
viagem: document.getElementById("viagem").value,
carga: document.getElementById("carga").value

});

localStorage.setItem(
"navios",
JSON.stringify(navios)
);

carregarNavios();

}

function carregarNavios(){

let navios =
JSON.parse(localStorage.getItem("navios") || "[]");

let tabela =
document.getElementById("listaNavios");

tabela.innerHTML="";

navios.forEach(item=>{

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

function avancarEtapa(){

if(etapaAtual <= 12){

document
.getElementById("e"+etapaAtual)
.classList.add("concluida");

etapaAtual++;

document
.getElementById("totalEtapas")
.innerText = etapaAtual - 1;

}

}

function registrarOcorrencia(){

let ocorrencias =
JSON.parse(
localStorage.getItem("ocorrencias") || "[]"
);

ocorrencias.push({

data:new Date().toLocaleString(),

descricao:
document.getElementById("descricao").value

});

localStorage.setItem(
"ocorrencias",
JSON.stringify(ocorrencias)
);

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

ocorrencias.forEach(item=>{

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

carregarNavios();
carregarOcorrencias();
