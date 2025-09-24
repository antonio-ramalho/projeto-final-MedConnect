document.getElementById("botao-login").addEventListener("click", function () {
  login();
});

async function login() {
  var login = "";
  var senha = "";

  login = document.getElementById("login").value;
  senha = document.getElementById("senha").value;

  const fd = new FormData();
  fd.append("login", login);
  fd.append("senha", senha);

  const retorno = await fetch("../php/login.php", {
    method: "POST",
    body: fd,
  });

  const resposta = await retorno.json();
  alert(resposta.msg);

  if (resposta.value) {
    const id_usuario = resposta.id;
    const params = new URLSearchParams();

    localStorage.setItem("usuarioLogado", "true");
    localStorage.setItem("nomeUsuario", resposta.user);
    params.append("id", id_usuario);
    window.location.href = `../html/cordenador.html?${params.toString()}`;
  } else {
    localStorage.setItem("usuarioLogado", "false");
  }
}
