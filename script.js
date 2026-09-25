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
  }

  let responsavelDashboard = document.getElementById("usuarioResponsavel"); 
  if (responsavelDashboard) { 
    responsavelDashboard.innerText = encontrado.usuario; 
  } 

  aplicarPermissoes(); 
  atualizarWorkflow(); 
} // <--- Chave que estava faltando para fechar a função!

function logout() {
  localStorage.removeItem("usuarioLogado"); 
  location.reload(); 
}
