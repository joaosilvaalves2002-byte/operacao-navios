// =====================================
// USUÁRIOS
// =====================================

const usuarios = [

{
usuario:"documental",
senha:"123",
area:"DOCUMENTAL"
},

{
usuario:"planejamento",
senha:"123",
area:"PLANEJAMENTO"
},

{
usuario:"operacional",
senha:"123",
area:"OPERACIONAL"
},

{
usuario:"patrimonial",
senha:"123",
area:"PATRIMONIAL"
},

{
usuario:"sst",
senha:"123",
area:"SST"
},

{
usuario:"riscos",
senha:"123",
area:"RISCOS"
}

];

// =====================================
// WORKFLOW
// =====================================

const workflow = [

{
id:1,
etapa:"Manifesto Conferido",
responsavel:"DOCUMENTAL"
},

{
id:2,
etapa:"Carga Inserida Sistema",
responsavel:"PLANEJAMENTO"
},

{
id:3,
etapa:"Remoção Pátio",
responsavel:"PLANEJAMENTO"
},

{
id:4,
etapa:"Aviso Atracação",
responsavel:"PLANEJAMENTO"
},

{
id:5,
etapa:"Atracação",
responsavel:"OPERACIONAL"
},

{
id:6,
etapa:"Guaritas Posicionadas",
responsavel:"OPERACIONAL"
},

{
id:7,
etapa:"Vistoria SST",
responsavel:"SST"
},

{
id:8,
etapa:"Inspeção Patrimonial",
responsavel:"PATRIMONIAL"
},

{
id:9,
etapa:"Checklist Caminhões",
responsavel:"OPERACIONAL"
},

{
id:10,
etapa:"DDS",
responsavel:"SST"
},

{
id:11,
etapa:"Operação",
responsavel:"OPERACIONAL"
},

{
id:12,
etapa:"Documentação Saída",
responsavel:"PLANEJAMENTO"
},

{
id:13,
etapa:"Visita Final",
responsavel:"PLANEJAMENTO"
},

{
id:14,
etapa:"Desatracação",
responsavel:"OPERACIONAL"
}

];

// =====================================
// LOGIN
// =====================================

function fazerLogin(){

let usuario =
document.getElementById("usuario").value;

let senha =
document.getElementById("senha").value;

let encontrado =
usuarios.find(u =>

u.usuario === usuario &&
u.senha === senha

);

if(!encontrado){

alert("Usuário inválido");

return;

}

localStorage.setItem(
"usuarioLogado",
JSON.stringify(encontrado)
);

document
.getElementById("login")
.classList.add("oculto");

document
.getElementById("sistema")
.classList.remove("oculto");

let campoUsuario =
document.getElementById(
"usuarioLogadoTexto"
);

if(campoUsuario){

campoUsuario.innerHTML =
encontrado.usuario +
"<br>" +
encontrado.area;

}

aplicarPermissoes();

atualizarWorkflow();

}

// =====================================
// LOGOUT
// =====================================

function logout(){

localStorage.removeItem(
"usuarioLogado"
);

location.reload();

}

// =====================================
// PERMISSÕES
// =====================================

function aplicarPermissoes(){

const usuario =
JSON.parse(
localStorage.getItem(
"usuarioLogado"
)
);

if(!usuario) return;

let botoes = [
"btnNavios",
"btnPatrimonial",
"btnSST",
"btnRiscos"
];

botoes.forEach(id=>{

let botao =
document.getElementById(id);

if(botao){
botao.style.display="none";
}

});

switch(usuario.area){

case "PLANEJAMENTO":

if(document.getElementById("btnNavios"))
document.getElementById("btnNavios")
.style.display="block";

break;

case "PATRIMONIAL":

if(document.getElementById("btnPatrimonial"))
document.getElementById("btnPatrimonial")
.style.display="block";

break;

case "SST":

if(document.getElementById("btnSST"))
document.getElementById("btnSST")
.style.display="block";

break;

case "RISCOS":

if(document.getElementById("btnRiscos"))
document.getElementById("btnRiscos")
.style.display="block";

break;

}

}

// =====================================
// NAVEGAÇÃO
// =====================================

function mostrarTela(tela){

const paginas = [

"dashboard",
"navios",
"caminhoes",
"patrimonial",
"sst",
"riscos",
"fluxo",
"ocorrencias"

];

paginas.forEach(p => {

let elemento =
document.getElementById(p);

if(elemento){

elemento.classList.add(
"oculto"
);

}

});

document
.getElementById(tela)
.classList.remove("oculto");

}

// =====================================
// WORKFLOW
// =====================================

function iniciarWorkflow(){

if(
!localStorage.getItem(
"workflowAtual"
)
){

localStorage.setItem(
"workflowAtual",
"1"
);

}

atualizarWorkflow();

}

function atualizarWorkflow(){

let atual =
Number(
localStorage.getItem(
"workflowAtual"
)
);

let etapa =
workflow.find(
w => w.id === atual
);

if(!etapa) return;

let status =
document.getElementById(
"statusAtual"
);

let responsavel =
document.getElementById(
"responsavelAtual"
);

if(status)
status.innerText =
etapa.etapa;

if(responsavel)
responsavel.innerText =
etapa.responsavel;

}

function concluirEtapa(){

let atual = Number(
localStorage.getItem(
"workflowAtual"
)
);

let usuario =
JSON.parse(
localStorage.getItem(
"usuarioLogado"
)
);

if(!usuario) return;

let etapa =
workflow.find(
w => w.id === atual
);

if(!etapa) return;

if(
etapa.responsavel !==
usuario.area
){

alert(
"Esta etapa pertence a " +
etapa.responsavel
);

return;

}

let historico =
JSON.parse(
localStorage.getItem(
"historico"
) || "[]"
);

historico.push({

etapa: etapa.etapa,

usuario: usuario.usuario,

area: usuario.area,

data: new Date()
.toLocaleString()

});

localStorage.setItem(
"historico",
JSON.stringify(historico)
);

localStorage.setItem(
"workflowAtual",
atual + 1
);

atualizarWorkflow();

alert(
"Etapa concluída com sucesso."
);

}

// =====================================
// NAVIOS
// =====================================

function salvarNavio(){

let navio =
document.getElementById("navio").value;

if(navio === ""){

alert(
"Informe o nome do navio."
);

return;

}

let navios =
JSON.parse(
localStorage.getItem(
"navios"
) || "[]"
);

navios.push({

navio,

armador:
document.getElementById(
"armador"
).value,

berco:
document.getElementById(
"berco"
).value,

viagem:
document.getElementById(
"viagem"
).value,

carga:
document.getElementById(
"carga"
).value

});

localStorage.setItem(
"navios",
JSON.stringify(navios)
);

carregarNavios();

}

function carregarNavios(){

let tabela =
document.getElementById(
"listaNavios"
);

if(!tabela) return;

let navios =
JSON.parse(
localStorage.getItem(
"navios"
) || "[]"
);

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

let total =
document.getElementById(
"totalNavios"
);

if(total)
total.innerText =
navios.length;

}

// =====================================
// CAMINHÕES
// =====================================

function salvarCaminhao(){

let lista =
JSON.parse(
localStorage.getItem(
"caminhoes"
) || "[]"
);

lista.push({

placa:
document.getElementById(
"placa"
).value,

motorista:
document.getElementById(
"motorista"
).value,

transportadora:
document.getElementById(
"transportadora"
).value

});

localStorage.setItem(
"caminhoes",
JSON.stringify(lista)
);

carregarCaminhoes();

}

function carregarCaminhoes(){

let tabela =
document.getElementById(
"listaCaminhoes"
);

if(!tabela) return;

let lista =
JSON.parse(
localStorage.getItem(
"caminhoes"
) || "[]"
);

tabela.innerHTML="";

lista.forEach(item=>{

tabela.innerHTML+=`
<tr>
<td>${item.placa}</td>
<td>${item.motorista}</td>
<td>${item.transportadora}</td>
</tr>
`;

});

}

// =====================================
// OCORRÊNCIAS
// =====================================

function registrarOcorrencia(){

let descricao =
document.getElementById(
"descricao"
).value;

if(descricao==="") return;

let ocorrencias =
JSON.parse(
localStorage.getItem(
"ocorrencias"
) || "[]"
);

ocorrencias.push({

data:new Date()
.toLocaleString(),

descricao

});

localStorage.setItem(
"ocorrencias",
JSON.stringify(
ocorrencias
)
);

carregarOcorrencias();

}

function carregarOcorrencias(){

let tabela =
document.getElementById(
"listaOcorrencias"
);

if(!tabela) return;

let ocorrencias =
JSON.parse(
localStorage.getItem(
"ocorrencias"
) || "[]"
);

tabela.innerHTML="";

ocorrencias.forEach(item=>{

tabela.innerHTML+=`
<tr>
<td>${item.data}</td>
<td>${item.descricao}</td>
</tr>
`;

});

let total =
document.getElementById(
"totalOcorrencias"
);

if(total)
total.innerText =
ocorrencias.length;

}

// =====================================
// RISCOS
// =====================================

function registrarRisco(){

let lista =
JSON.parse(
localStorage.getItem(
"riscos"
) || "[]"
);

lista.push({

data:new Date()
.toLocaleString(),

tipo:
document.getElementById(
"tipoRisco"
).value,

descricao:
document.getElementById(
"descricaoRisco"
).value

});

localStorage.setItem(
"riscos",
JSON.stringify(lista)
);

carregarRiscos();

}

function carregarRiscos(){

let tabela =
document.getElementById(
"listaRiscos"
);

if(!tabela) return;

let lista =
JSON.parse(
localStorage.getItem(
"riscos"
) || "[]"
);

tabela.innerHTML="";

lista.forEach(item=>{

tabela.innerHTML+=`
<tr>
<td>${item.data}</td>
<td>${item.tipo}</td>
<td>${item.descricao}</td>
</tr>
`;

});

}

// =====================================
// INICIALIZAÇÃO
// =====================================

carregarNavios();
carregarOcorrencias();
carregarCaminhoes();
carregarRiscos();

iniciarWorkflow();

let usuarioSalvo =
localStorage.getItem(
"usuarioLogado"
);

if(usuarioSalvo){

document
.getElementById("login")
.classList.add("oculto");

document
.getElementById("sistema")
.classList.remove("oculto");

let usuario =
JSON.parse(usuarioSalvo);

let campo =
document.getElementById(
"usuarioLogadoTexto"
);

if(campo){

campo.innerHTML =
usuario.usuario +
"<br>" +
usuario.area;

let responsavelDashboard =
document.getElementById(
"usuarioResponsavel"
);

if(responsavelDashboard){

responsavelDashboard.innerHTML =
usuario.usuario +
" (" +
usuario.area +
")";

}

}

aplicarPermissoes();

atualizarWorkflow();

}
