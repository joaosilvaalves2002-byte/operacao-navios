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
// LOGIN
// =====================================

function fazerLogin() {

  const usuario =
    document.getElementById("usuario").value;

  const senha =
    document.getElementById("senha").value;

  const encontrado =
    usuarios.find(u =>
      u.usuario === usuario &&
      u.senha === senha
    );

  if (!encontrado) {

    alert("Usuário ou senha inválidos.");
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

  atualizarUsuarioLogado();

  aplicarPermissoes();

  atualizarWorkflow();

  atualizarTarefaAtual();

}

// =====================================
// LOGOUT
// =====================================

function logout() {

  localStorage.removeItem(
    "usuarioLogado"
  );

  location.reload();

}

// =====================================
// USUÁRIO LOGADO
// =====================================

function atualizarUsuarioLogado() {

  const usuario =
    JSON.parse(
      localStorage.getItem(
        "usuarioLogado"
      )
    );

  if (!usuario) return;

  const lado =
    document.getElementById(
      "usuarioLogadoTexto"
    );

  if (lado) {

    lado.innerHTML =
      usuario.usuario +
      "<br>" +
      usuario.area;

  }

  const dash =
    document.getElementById(
      "usuarioResponsavel"
    );

  if (dash) {

    dash.innerText =
      usuario.usuario;

  }

}

// =====================================
// PERMISSÕES
// =====================================

function aplicarPermissoes() {

  const usuario =
    JSON.parse(
      localStorage.getItem(
        "usuarioLogado"
      )
    );

  if (!usuario) return;

  [
    "btnNavios",
    "btnPatrimonial",
    "btnSST",
    "btnRiscos"
  ].forEach(id => {

    const btn =
      document.getElementById(id);

    if (btn)
      btn.style.display = "none";

  });

  switch(usuario.area){

    case "PLANEJAMENTO":

      document.getElementById("btnNavios").style.display = "block";
      break;

    case "PATRIMONIAL":

      document.getElementById("btnPatrimonial").style.display = "block";
      break;

    case "SST":

      document.getElementById("btnSST").style.display = "block";
      break;

    case "RISCOS":

      document.getElementById("btnRiscos").style.display = "block";
      break;

  }

}

// =====================================
// NAVEGAÇÃO
// =====================================

function mostrarTela(tela) {

  const paginas = [
    "dashboard",
    "tarefas",
    "navios",
    "caminhoes",
    "patrimonial",
    "sst",
    "riscos",
    "fluxo",
    "ocorrencias"
  ];

  paginas.forEach(p => {

    const el =
      document.getElementById(p);

    if (el)
      el.classList.add("oculto");

  });

  document
    .getElementById(tela)
    .classList.remove("oculto");

}

// =====================================
// WORKFLOW
// =====================================

function iniciarWorkflow() {

  if (
    !localStorage.getItem(
      "workflowAtual"
    )
  ) {

    localStorage.setItem(
      "workflowAtual",
      "1"
    );

  }

  atualizarWorkflow();

  atualizarTarefaAtual();

}

function atualizarWorkflow() {

  const atual =
    Number(
      localStorage.getItem(
        "workflowAtual"
      )
    );

  const status =
    document.getElementById(
      "statusAtual"
    );

  const responsavel =
    document.getElementById(
      "responsavelAtual"
    );

  const proximaArea =
    document.getElementById(
      "proximaArea"
    );

  if (atual > workflow.length) {

    if(status)
      status.innerText =
      "Fluxo Concluído";

    if(responsavel)
      responsavel.innerText =
      "Finalizado";

    if(proximaArea)
      proximaArea.innerText =
      "-";

    return;

  }

  const etapa =
    workflow.find(
      w => w.id === atual
    );

  if (!etapa) return;

  status.innerText =
    etapa.etapa;

  responsavel.innerText =
    etapa.responsavel;

  const proxima =
    workflow.find(
      w => w.id === atual + 1
    );

  if(proximaArea){

    proximaArea.innerText =
      proxima
      ? proxima.responsavel
      : "Finalizado";

  }

}

function atualizarTarefaAtual() {

  const tarefa =
    document.getElementById(
      "tarefaAtual"
    );

  if (!tarefa) return;

  const usuario =
    JSON.parse(
      localStorage.getItem(
        "usuarioLogado"
      )
    );

  const atual =
    Number(
      localStorage.getItem(
        "workflowAtual"
      )
    );

  if (atual > workflow.length) {

    tarefa.innerText =
      "Nenhuma tarefa pendente";

    return;

  }

  const etapa =
    workflow.find(
      w => w.id === atual
    );

  if (
    !usuario ||
    !etapa
  ) return;

  if (
    etapa.responsavel !==
    usuario.area
  ) {

    tarefa.innerText =
      "Nenhuma tarefa disponível para sua área.";

    return;

  }

  tarefa.innerText =
    etapa.etapa;

}

function concluirEtapa() {

  const atual =
    Number(
      localStorage.getItem(
        "workflowAtual"
      )
    );

  if (atual > workflow.length) {

    alert(
      "Todas as etapas já foram concluídas."
    );

    return;
  }

  const usuario =
    JSON.parse(
      localStorage.getItem(
        "usuarioLogado"
      )
    );

  const etapa =
    workflow.find(
      w => w.id === atual
    );

  if (
    etapa.responsavel !==
    usuario.area
  ) {

    alert(
      "Esta etapa pertence à área " +
      etapa.responsavel
    );

    return;
  }

  const historico =
    JSON.parse(
      localStorage.getItem(
        "historico"
      ) || "[]"
    );

  historico.push({

    etapa:
      etapa.etapa,

    usuario:
      usuario.usuario,

    area:
      usuario.area,

    data:
      new Date()
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
  atualizarTarefaAtual();
  carregarHistorico();

  alert(
    "Etapa concluída com sucesso."
  );

}

// =====================================
// HISTÓRICO
// =====================================

function carregarHistorico() {

  const historico =
    JSON.parse(
      localStorage.getItem(
        "historico"
      ) || "[]"
    );

  const div =
    document.getElementById(
      "historicoWorkflow"
    );

  if (!div) return;

  div.innerHTML = "";

  historico
    .slice()
    .reverse()
    .forEach(item => {

      div.innerHTML += `
        <div style="padding:10px;border-bottom:1px solid #ddd;">
          <strong>${item.etapa}</strong><br>
          ${item.area}<br>
          ${item.usuario}<br>
          ${item.data}
        </div>
      `;

    });

}

// =====================================
// NAVIOS
// =====================================

function salvarNavio() {

  const navio =
    document.getElementById("navio");

  if (
    !navio ||
    navio.value.trim() === ""
  ) {

    alert(
      "Informe o nome do navio."
    );

    return;

  }

  const lista =
    JSON.parse(
      localStorage.getItem(
        "navios"
      ) || "[]"
    );

  lista.push({

    navio: navio.value,

    armador:
      document.getElementById("armador").value,

    berco:
      document.getElementById("berco").value,

    viagem:
      document.getElementById("viagem").value,

    carga:
      document.getElementById("carga").value

  });

  localStorage.setItem(
    "navios",
    JSON.stringify(lista)
  );

  carregarNavios();

}

function carregarNavios() {

  const tabela =
    document.getElementById(
      "listaNavios"
    );

  if (!tabela) return;

  const lista =
    JSON.parse(
      localStorage.getItem(
        "navios"
      ) || "[]"
    );

  tabela.innerHTML = "";

  lista.forEach(item => {

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

  document.getElementById(
    "totalNavios"
  ).innerText = lista.length;

}

// =====================================
// CAMINHÕES
// =====================================

function salvarCaminhao() {

  const lista =
    JSON.parse(
      localStorage.getItem(
        "caminhoes"
      ) || "[]"
    );

  lista.push({

    placa:
      document.getElementById("placa").value,

    motorista:
      document.getElementById("motorista").value,

    transportadora:
      document.getElementById("transportadora").value

  });

  localStorage.setItem(
    "caminhoes",
    JSON.stringify(lista)
  );

  carregarCaminhoes();

}

function carregarCaminhoes() {

  const tabela =
    document.getElementById(
      "listaCaminhoes"
    );

  if (!tabela) return;

  const lista =
    JSON.parse(
      localStorage.getItem(
        "caminhoes"
      ) || "[]"
    );

  tabela.innerHTML = "";

  lista.forEach(item => {

    tabela.innerHTML += `
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

function registrarOcorrencia() {

  const descricao =
    document.getElementById(
      "descricao"
    ).value;

  if (!descricao) return;

  const lista =
    JSON.parse(
      localStorage.getItem(
        "ocorrencias"
      ) || "[]"
    );

  lista.push({

    data:
      new Date()
      .toLocaleString(),

    descricao

  });

  localStorage.setItem(
    "ocorrencias",
    JSON.stringify(lista)
  );

  carregarOcorrencias();

}

function carregarOcorrencias() {

  const tabela =
    document.getElementById(
      "listaOcorrencias"
    );

  if (!tabela) return;

  const lista =
    JSON.parse(
      localStorage.getItem(
        "ocorrencias"
      ) || "[]"
    );

  tabela.innerHTML = "";

  lista.forEach(item => {

    tabela.innerHTML += `
      <tr>
        <td>${item.data}</td>
        <td>${item.descricao}</td>
      </tr>
    `;

  });

  document.getElementById(
    "totalOcorrencias"
  ).innerText =
  lista.length;

}

// =====================================
// RISCOS
// =====================================

function registrarRisco() {

  const lista =
    JSON.parse(
      localStorage.getItem(
        "riscos"
      ) || "[]"
    );

  lista.push({

    data:
      new Date()
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

function carregarRiscos() {

  const tabela =
    document.getElementById(
      "listaRiscos"
    );

  if (!tabela) return;

  const lista =
    JSON.parse(
      localStorage.getItem(
        "riscos"
      ) || "[]"
    );

  tabela.innerHTML = "";

  lista.forEach(item => {

    tabela.innerHTML += `
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
carregarCaminhoes();
carregarOcorrencias();
carregarRiscos();
carregarHistorico();

iniciarWorkflow();

const usuarioSalvo =
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

  atualizarUsuarioLogado();
  aplicarPermissoes();
  atualizarWorkflow();
  atualizarTarefaAtual();

}
