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
    localStorage.setItem("usuarioLogado", resposta.user);
    window.location.href = "../html/cordenador.html";
  }
}
