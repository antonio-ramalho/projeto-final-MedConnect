document.addEventListener("DOMContentLoaded", () => {
  verSeEstaLogado();

  function verSeEstaLogado() {
    const usuarioLogado = localStorage.getItem("usuarioLogado");

    if (!usuarioLogado || localStorage.getItem('usuarioLogado') === 'false') {
      window.location.href = "../html/login.html";
    }
  }

  mostraNomeUsuario();

  function mostraNomeUsuario() {
    const nomeUsuario = localStorage.getItem("usuarioLogado");
    document.getElementById("nome-usuario").textContent = nomeUsuario;
  }

  const conteudoPrincipal = document.getElementById("conteudo-principal");
  const links = document.querySelectorAll(".sidebar a");

  function carregarPagina(url) {
    fetch(url)
      .then((response) => response.text())
      .then((html) => {
        conteudoPrincipal.innerHTML = html;
      })
      .catch((error) => {
        console.error("Erro ao carregar a página:", error);
        conteudoPrincipal.innerHTML = "<p>Erro ao carregar o conteúdo.</p>";
      });
  }

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const page = link.getAttribute("data-page");
      carregarPagina(page);
    });
  });
  carregarPagina("dashboard.html");
});
