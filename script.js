// ==========================================
// CONFIGURAÇÃO DE USUÁRIOS E WORKFLOW
// ==========================================

const usuarios = [
  { usuario: "admin", senha: "123", area: "TODAS" },
  { usuario: "documental", senha: "123", area: "DOCUMENTAL" },
  { usuario: "planejamento", senha: "123", area: "PLANEJAMENTO" },
  { usuario: "operacional", senha: "123", area: "OPERACIONAL" },
  { usuario: "sst", senha: "123", area: "SST" },
  { usuario: "patrimonial", senha: "123", area: "PATRIMONIAL" }
];

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

// ==========================================
// AUTENTICAÇÃO E SESSÃO
// ==========================================

function fazerLogin() {
  const user = document.getElementById("usuario").value.trim();
  const pass = document.getElementById("senha").value.trim();

  const encontrado = usuarios.find(u => u.usuario === user && u.senha === pass);

  if (!encontrado) {
    alert("Usuário ou senha inválidos.");
    return;
  }

  localStorage.setItem("usuarioLogado", JSON.stringify(encontrado));
  iniciarSistema();
}

function logout() {
  localStorage.removeItem("usuarioLogado");
  document.getElementById("login").classList.remove("oculto");
  document.getElementById("sistema").classList.add("oculto");
  document.getElementById("usuario").value = "";
  document.getElementById("senha").value = "";
}

function verificarSessao() {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (usuarioLogado) {
    iniciarSistema();
  }
}

function iniciarSistema() {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  document.getElementById("login").classList.add("oculto");
  document.getElementById("sistema").classList.remove("oculto");

  const txtUsuario = document.getElementById("usuarioLogadoTexto");
  if (txtUsuario) {
    txtUsuario.innerText = `Usuário: ${usuarioLogado.usuario} (${usuarioLogado.area})`;
  }

  const usrResp = document.getElementById("usuarioResponsavel");
  if (usrResp) {
    usrResp.innerText = usuarioLogado.usuario.toUpperCase();
  }

  if (!localStorage.getItem("workflowAtual")) {
    localStorage.setItem("workflowAtual", 1);
  }

  carregarNavios();
  carregarCaminhoes();
  carregarRiscos();
  carregarOcorrencias();
  carregarHistorico();
  atualizarWorkflow();
  atualizarTarefaAtual();
  mostrarTela("dashboard");
}

// ==========================================
// NAVEGAÇÃO DE TELAS
// ==========================================

function mostrarTela(tela) {
  const paginas = [
    "dashboard", "historico", "tarefas", "navios", 
    "caminhoes", "patrimonial", "sst", "riscos", "fluxo", "ocorrencias"
  ];

  paginas.forEach(p => {
    const el = document.getElementById(p);
    if (el) el.classList.add("oculto");
  });

  const telaAlvo = document.getElementById(tela);
  if (telaAlvo) {
    telaAlvo.classList.remove("oculto");
  }
}

// ==========================================
// WORKFLOW E HISTÓRICO
// ==========================================

function atualizarWorkflow() {
  const atual = Number(localStorage.getItem("workflowAtual") || 1);

  // Destacar no fluxo visual
  workflow.forEach(w => {
    const el = document.getElementById(`e${w.id}`);
    if (el) {
      el.classList.remove("concluido", "ativo");
      if (w.id < atual) {
        el.classList.add("concluido");
      } else if (w.id === atual) {
        el.classList.add("ativo");
      }
    }
  });

  // Atualizar informações do Dashboard
  const etapaAtual = workflow.find(w => w.id === atual);
  const proximaEtapa = workflow.find(w => w.id === atual + 1);

  const elStatus = document.getElementById("statusAtual");
  const elResp = document.getElementById("responsavelAtual");
  const elProx = document.getElementById("proximaArea");
  const elTotalEtapas = document.getElementById("totalEtapas");

  if (etapaAtual) {
    if (elStatus) elStatus.innerText = etapaAtual.etapa;
    if (elResp) elResp.innerText = etapaAtual.responsavel;
  } else {
    if (elStatus) elStatus.innerText = "Operação Concluída";
    if (elResp) elResp.innerText = "NENHUM";
  }

  if (proximaEtapa) {
    if (elProx) elProx.innerText = `${proximaEtapa.responsavel} (${proximaEtapa.etapa})`;
  } else {
    if (elProx) elProx.innerText = "Fim do Processo";
  }

  if (elTotalEtapas) {
    const concluidas = Math.min(atual - 1, workflow.length);
    elTotalEtapas.innerText = `${concluidas} / ${workflow.length}`;
  }
}

function concluirEtapa() {
  const atual = Number(localStorage.getItem("workflowAtual") || 1);

  if (atual > workflow.length) {
    alert("Todas as etapas do workflow já foram concluídas.");
    return;
  }

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuarioLogado) return;

  const etapa = workflow.find(w => w.id === atual);
  if (!etapa) return;

  if (usuarioLogado.area !== "TODAS" && etapa.responsavel !== usuarioLogado.area) {
    alert(`Apenas o setor ${etapa.responsavel} pode concluir esta etapa.`);
    return;
  }

  // Registrar no Histórico
  const historico = JSON.parse(localStorage.getItem("historico") || "[]");
  historico.push({
    id: historico.length + 1,
    etapa: etapa.etapa,
    usuario: usuarioLogado.usuario,
    area: usuarioLogado.area,
    data: new Date().toLocaleString("pt-BR")
  });

  localStorage.setItem("historico", JSON.stringify(historico));
  localStorage.setItem("workflowAtual", atual + 1);

  atualizarWorkflow();
  atualizarTarefaAtual();
  carregarHistorico();

  alert(`Etapa "${etapa.etapa}" concluída com sucesso!`);
}

function atualizarTarefaAtual() {
  const atual = Number(localStorage.getItem("workflowAtual") || 1);
  const etapa = workflow.find(w => w.id === atual);
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  const elTarefa = document.getElementById("tarefaAtual");
  if (!elTarefa) return;

  if (!etapa) {
    elTarefa.innerText = "Nenhuma tarefa pendente (Fluxo Finalizado).";
    return;
  }

  if (usuarioLogado.area === "TODAS" || etapa.responsavel === usuarioLogado.area) {
    elTarefa.innerText = `${etapa.etapa} (${etapa.responsavel})`;
  } else {
    elTarefa.innerText = `Aguardando setor ${etapa.responsavel} concluir a etapa "${etapa.etapa}".`;
  }
}

function carregarHistorico() {
  const tbody = document.getElementById("listaHistorico");
  if (!tbody) return;

  const historico = JSON.parse(localStorage.getItem("historico") || "[]");
  let html = "";

  historico.forEach((item, idx) => {
    html += `
      <tr>
        <td>${idx + 1}</td>
        <td>${item.etapa}</td>
        <td>${item.usuario}</td>
        <td>${item.area}</td>
        <td>${item.data}</td>
      </tr>
    `;
  });

  tbody.innerHTML = html || `<tr><td colspan="5" style="text-align:center;">Nenhum histórico registrado até o momento.</td></tr>`;
}

// ==========================================
// CADASTROS E MÓDULOS (NAVIOS, CAMINHÕES, ETC)
// ==========================================

function salvarNavio() {
  const navio = document.getElementById("navio").value.trim();
  const armador = document.getElementById("armador").value.trim();
  const berco = document.getElementById("berco").value.trim();
  const viagem = document.getElementById("viagem").value.trim();
  const carga = document.getElementById("carga").value.trim();

  if (!navio) {
    alert("Informe o nome do navio.");
    return;
  }

  const navios = JSON.parse(localStorage.getItem("navios") || "[]");
  navios.push({ navio, armador, berco, viagem, carga });
  localStorage.setItem("navios", JSON.stringify(navios));

  document.getElementById("navio").value = "";
  document.getElementById("armador").value = "";
  document.getElementById("berco").value = "";
  document.getElementById("viagem").value = "";
  document.getElementById("carga").value = "";

  carregarNavios();
}

function carregarNavios() {
  const tbody = document.getElementById("listaNavios");
  const navios = JSON.parse(localStorage.getItem("navios") || "[]");

  if (tbody) {
    tbody.innerHTML = navios.map(n => `
      <tr>
        <td>${n.navio}</td>
        <td>${n.armador}</td>
        <td>${n.berco}</td>
        <td>${n.viagem}</td>
        <td>${n.carga}</td>
      </tr>
    `).join("");
  }

  const elTotal = document.getElementById("totalNavios");
  if (elTotal) elTotal.innerText = navios.length;
}

function salvarCaminhao() {
  const placa = document.getElementById("placa").value.trim();
  const motorista = document.getElementById("motorista").value.trim();
  const transportadora = document.getElementById("transportadora").value.trim();

  if (!placa) {
    alert("Informe a placa do caminhão.");
    return;
  }

  const caminhoes = JSON.parse(localStorage.getItem("caminhoes") || "[]");
  caminhoes.push({ placa, motorista, transportadora });
  localStorage.setItem("caminhoes", JSON.stringify(caminhoes));

  document.getElementById("placa").value = "";
  document.getElementById("motorista").value = "";
  document.getElementById("transportadora").value = "";

  carregarCaminhoes();
}

function carregarCaminhoes() {
  const tbody = document.getElementById("listaCaminhoes");
  const caminhoes = JSON.parse(localStorage.getItem("caminhoes") || "[]");

  if (tbody) {
    tbody.innerHTML = caminhoes.map(c => `
      <tr>
        <td>${c.placa}</td>
        <td>${c.motorista}</td>
        <td>${c.transportadora}</td>
      </tr>
    `).join("");
  }
}

function registrarRisco() {
  const tipo = document.getElementById("tipoRisco").value;
  const descricao = document.getElementById("descricaoRisco").value.trim();

  if (!descricao) {
    alert("Descreva o risco / avaria.");
    return;
  }

  const riscos = JSON.parse(localStorage.getItem("riscos") || "[]");
  riscos.push({
    data: new Date().toLocaleString("pt-BR"),
    tipo,
    descricao
  });

  localStorage.setItem("riscos", JSON.stringify(riscos));
  document.getElementById("descricaoRisco").value = "";
  carregarRiscos();
}

function carregarRiscos() {
  const tbody = document.getElementById("listaRiscos");
  const riscos = JSON.parse(localStorage.getItem("riscos") || "[]");

  if (tbody) {
    tbody.innerHTML = riscos.map(r => `
      <tr>
        <td>${r.data}</td>
        <td>${r.tipo}</td>
        <td>${r.descricao}</td>
      </tr>
    `).join("");
  }
}

function registrarOcorrencia() {
  const descricao = document.getElementById("descricao").value.trim();

  if (!descricao) {
    alert("Preencha a descrição da ocorrência.");
    return;
  }

  const ocorrencias = JSON.parse(localStorage.getItem("ocorrencias") || "[]");
  ocorrencias.push({
    data: new Date().toLocaleString("pt-BR"),
    descricao
  });

  localStorage.setItem("ocorrencias", JSON.stringify(ocorrencias));
  document.getElementById("descricao").value = "";
  carregarOcorrencias();
}

function carregarOcorrencias() {
  const tbody = document.getElementById("listaOcorrencias");
  const ocorrencias = JSON.parse(localStorage.getItem("ocorrencias") || "[]");

  if (tbody) {
    tbody.innerHTML = ocorrencias.map(o => `
      <tr>
        <td>${o.data}</td>
        <td>${o.descricao}</td>
      </tr>
    `).join("");
  }

  const elTotal = document.getElementById("totalOcorrencias");
  if (elTotal) elTotal.innerText = ocorrencias.length;
}

// Inicializar ao carregar a página
window.onload = function() {
  verificarSessao();
};
