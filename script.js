// =====================================
// USUÁRIOS
// =====================================
const usuarios = [
  { usuario: "documental", senha: "123", area: "DOCUMENTAL" },
  { usuario: "planejamento", senha: "123", area: "PLANEJAMENTO" },
  { usuario: "operacional", senha: "123", area: "OPERACIONAL" },
  { usuario: "patrimonial", senha: "123", area: "PATRIMONIAL" },
  { usuario: "sst", senha: "123", area: "SST" },
  { usuario: "riscos", senha: "123", area: "RISCOS" }
];

// =====================================
// WORKFLOW
// =====================================
const workflow = [
  { id: 1, etapa: "Manifesto Conferido", responsavel: "DOCUMENTAL" },
  { id: 2, etapa: "Carga Inserida Sistema", responsavel: "PLANEJAMENTO" },
  { id: 3, etapa: "Remoção Pátio", responsavel: "PLANEJAMENTO" },
  { id: 4, etapa: "Aviso Atracação", responsavel: "PLANEJAMENTO" },
  { id: 5, etapa: "Atracação", responsavel: "OPERACIONAL" },
  { id: 6, etapa: "Guaritas Posicionadas", responsavel: "OPERACIONAL" },
  { id: 7, etapa: "Vistoria SST", responsavel: "SST" },
  { id: 8, etapa: "Inspeção Patrimonial", responsavel: "PATRIMONIAL" },
  { id: 9, etapa: "Checklist Caminhões", responsavel: "OPERACIONAL" },
  { id: 10, etapa: "DDS", responsavel: "SST" },
  { id: 11, etapa: "Operação", responsavel: "OPERACIONAL" },
  { id: 12, etapa: "Documentação Saída", responsavel: "PLANEJAMENTO" },
  { id: 13, etapa: "Visita Final", responsavel: "PLANEJAMENTO" },
  { id: 14, etapa: "Desatracação", responsavel: "OPERACIONAL" }
];

// =====================================
// LOGIN & LOGOUT
// =====================================
function fazerLogin() {
  let usuarioInput = document.getElementById("usuario");
  let senhaInput = document.getElementById("senha");
  if (!usuarioInput || !senhaInput) return;

  let usuario = usuarioInput.value;
  let senha = senhaInput.value;
  let encontrado = usuarios.find(u => u.usuario === usuario && u.senha === senha);

  if (!encontrado) {
    alert("Usuário ou senha inválidos.");
    return;
  }

  localStorage.setItem("usuarioLogado", JSON.stringify(encontrado));
  document.getElementById("login").classList.add("oculto");
  document.getElementById("sistema").classList.remove("oculto");

  let campoUsuario = document.getElementById("usuarioLogadoTexto");
  if (campoUsuario) {
    campoUsuario.innerHTML = encontrado.usuario + "<br>" + encontrado.area;
  let responsavelDashboard = document.getElementById("usuarioResponsavel");
  if(responsavelDashboard){
 
responsavelDashboard.innerText =
encontrado.usuario;
    
  }

  aplicarPermissoes();
  atualizarWorkflow();
}

function logout() {
  localStorage.removeItem("usuarioLogado");
  location.reload();
}

// =====================================
// PERMISSÕES
// =====================================
function aplicarPermissoes() {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuario) return;

  let botoes = ["btnNavios", "btnPatrimonial", "btnSST", "btnRiscos"];
  botoes.forEach(id => {
    let botao = document.getElementById(id);
    if (botao) botao.style.display = "none";
  });

  switch (usuario.area) {
    case "PLANEJAMENTO":
      if (document.getElementById("btnNavios")) document.getElementById("btnNavios").style.display = "block";
      break;
    case "PATRIMONIAL":
      if (document.getElementById("btnPatrimonial")) document.getElementById("btnPatrimonial").style.display = "block";
      break;
    case "SST":
      if (document.getElementById("btnSST")) document.getElementById("btnSST").style.display = "block";
      break;
    case "RISCOS":
      if (document.getElementById("btnRiscos")) document.getElementById("btnRiscos").style.display = "block";
      break;
  }
}

// =====================================
// NAVEGAÇÃO
// =====================================
function mostrarTela(tela) {
  const paginas = ["dashboard", "navios", "caminhoes", "patrimonial", "sst", "riscos", "fluxo", "ocorrencias"];
  paginas.forEach(p => {
    let elemento = document.getElementById(p);
    if (elemento) elemento.classList.add("oculto");
  });

  let telaAlvo = document.getElementById(tela);
  if (telaAlvo) telaAlvo.classList.remove("oculto");
}

// =====================================
// WORKFLOW
// =====================================
function iniciarWorkflow() {
  if (!localStorage.getItem("workflowAtual")) {
    localStorage.setItem("workflowAtual", "1");
  }
  atualizarWorkflow();
}

function atualizarWorkflow() {
  let atual = Number(localStorage.getItem("workflowAtual"));
  let status = document.getElementById("statusAtual");
  let responsavel = document.getElementById("responsavelAtual");

  if (atual > workflow.length) {
    if (status) status.innerText = "Fluxo Concluído";
    if (responsavel) responsavel.innerText = "Finalizado";
    return;
  }

  let etapa = workflow.find(w => w.id === atual);
  if (!etapa) return;

  if (status) status.innerText = etapa.etapa;
  if (responsavel) responsavel.innerText = etapa.responsavel;
}

function concluirEtapa() {
  let atual = Number(localStorage.getItem("workflowAtual"));
  if (atual > workflow.length) {
    alert("Todas as etapas do navio já foram concluídas.");
    return;
  }

  let usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuario) return;

  let etapa = workflow.find(w => w.id === atual);
  if (!etapa) return;

  if (etapa.responsavel !== usuario.area) {
    alert("Esta etapa pertence à área de " + etapa.responsavel);
    return;
  }

  let historico = JSON.parse(localStorage.getItem("historico") || "[]");
  historico.push({
    etapa: etapa.etapa,
    usuario: usuario.usuario,
    area: usuario.area,
    data: new Date().toLocaleString()
  });

  localStorage.setItem("historico", JSON.stringify(historico));
  localStorage.setItem("workflowAtual", atual + 1);
  atualizarWorkflow();
  alert("Etapa '" + etapa.etapa + "' concluída com sucesso.");
}

// =====================================
// NAVIOS
// =====================================
function salvarNavio() {
  let navioInput = document.getElementById("navio");
  if (!navioInput || navioInput.value.trim() === "") {
    alert("Informe o nome do navio.");
    return;
  }

  let armadorInput = document.getElementById("armador");
  let bercoInput = document.getElementById("berco");
  let viagemInput = document.getElementById("viagem");
  let cargaInput = document.getElementById("carga");

  let navios = JSON.parse(localStorage.getItem("navios") || "[]");
  navios.push({
    navio: navioInput.value,
    armador: armadorInput ? armadorInput.value : "",
    berco: bercoInput ? bercoInput.value : "",
    viagem: viagemInput ? viagemInput.value : "",
    carga: cargaInput ? cargaInput.value : ""
  });

  localStorage.setItem("navios", JSON.stringify(navios));

  // Limpa campos
  navioInput.value = "";
  if (armadorInput) armadorInput.value = "";
  if (bercoInput) bercoInput.value = "";
  if (viagemInput) viagemInput.value = "";
  if (cargaInput) cargaInput.value = "";

  carregarNavios();
}

function carregarNavios() {
  let tabela = document.getElementById("listaNavios");
  if (!tabela) return;

  let navios = JSON.parse(localStorage.getItem("navios") || "[]");
  let html = "";
  navios.forEach(item => {
    html += `
      <tr>
        <td>${item.navio}</td>
        <td>${item.armador}</td>
        <td>${item.berco}</td>
        <td>${item.viagem}</td>
        <td>${item.carga}</td>
      </tr>
    `;
  });
  tabela.innerHTML = html;

  let total = document.getElementById("totalNavios");
  if (total) total.innerText = navios.length;
}

// =====================================
// CAMINHÕES
// =====================================
function salvarCaminhao() {
  let placaInput = document.getElementById("placa");
  if (!placaInput || placaInput.value.trim() === "") {
    alert("Informe a placa do caminhão.");
    return;
  }

  let motoristaInput = document.getElementById("motorista");
  let transportadoraInput = document.getElementById("transportadora");

  let lista = JSON.parse(localStorage.getItem("caminhoes") || "[]");
  lista.push({
    placa: placaInput.value,
    motorista: motoristaInput ? motoristaInput.value : "",
    transportadora: transportadoraInput ? transportadoraInput.value : ""
  });

  localStorage.setItem("caminhoes", JSON.stringify(lista));

  // Limpa campos
  placaInput.value = "";
  if (motoristaInput) motoristaInput.value = "";
  if (transportadoraInput) transportadoraInput.value = "";

  carregarCaminhoes();
}

function carregarCaminhoes() {
  let tabela = document.getElementById("listaCaminhoes");
  if (!tabela) return;

  let lista = JSON.parse(localStorage.getItem("caminhoes") || "[]");
  let html = "";
  lista.forEach(item => {
    html += `
      <tr>
        <td>${item.placa}</td>
        <td>${item.motorista}</td>
        <td>${item.transportadora}</td>
      </tr>
    `;
  });
  tabela.innerHTML = html;
}

// =====================================
// OCORRÊNCIAS
// =====================================
function registrarOcorrencia() {
  let descricaoInput = document.getElementById("descricao");
  if (!descricaoInput || descricaoInput.value.trim() === "") {
    alert("Informe a descrição da ocorrência.");
    return;
  }

  let ocorrencias = JSON.parse(localStorage.getItem("ocorrencias") || "[]");
  ocorrencias.push({
    data: new Date().toLocaleString(),
    descricao: descricaoInput.value
  });

  localStorage.setItem("ocorrencias", JSON.stringify(ocorrencias));

  descricaoInput.value = "";
  carregarOcorrencias();
}

function carregarOcorrencias() {
  let tabela = document.getElementById("listaOcorrencias");
  if (!tabela) return;

  let ocorrencias = JSON.parse(localStorage.getItem("ocorrencias") || "[]");
  let html = "";
  ocorrencias.forEach(item => {
    html += `
      <tr>
        <td>${item.data}</td>
        <td>${item.descricao}</td>
      </tr>
    `;
  });
  tabela.innerHTML = html;

  let total = document.getElementById("totalOcorrencias");
  if (total) total.innerText = ocorrencias.length;
}

// =====================================
// RISCOS
// =====================================
function registrarRisco() {
  let descricaoInput = document.getElementById("descricaoRisco");
  if (!descricaoInput || descricaoInput.value.trim() === "") {
    alert("Informe a descrição do risco.");
    return;
  }

  let tipoInput = document.getElementById("tipoRisco");

  let lista = JSON.parse(localStorage.getItem("riscos") || "[]");
  lista.push({
    data: new Date().toLocaleString(),
    tipo: tipoInput ? tipoInput.value : "Geral",
    descricao: descricaoInput.value
  });

  localStorage.setItem("riscos", JSON.stringify(lista));

  descricaoInput.value = "";
  carregarRiscos();
}

function carregarRiscos() {
  let tabela = document.getElementById("listaRiscos");
  if (!tabela) return;

  let lista = JSON.parse(localStorage.getItem("riscos") || "[]");
  let html = "";
  lista.forEach(item => {
    html += `
      <tr>
        <td>${item.data}</td>
        <td>${item.tipo}</td>
        <td>${item.descricao}</td>
      </tr>
    `;
  });
  tabela.innerHTML = html;
}

// =====================================
// INICIALIZAÇÃO
// =====================================
carregarNavios();
carregarOcorrencias();
carregarCaminhoes();
carregarRiscos();
iniciarWorkflow();

let usuarioSalvo = localStorage.getItem("usuarioLogado");
if (usuarioSalvo) {
  let loginElem = document.getElementById("login");
  let sistemaElem = document.getElementById("sistema");
  if (loginElem) loginElem.classList.add("oculto");
  if (sistemaElem) sistemaElem.classList.remove("oculto");

  let usuario = JSON.parse(usuarioSalvo);
  let campo = document.getElementById("usuarioLogadoTexto");
  if (campo) {
    campo.innerHTML = usuario.usuario + "<br>" + usuario.area;
  }
  aplicarPermissoes();
  atualizarWorkflow();
}
