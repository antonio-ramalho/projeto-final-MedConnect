document.addEventListener("DOMContentLoaded", () => {
  // funcoes de login e checagem;
  verSeEstaLogado();

  function verSeEstaLogado() {
    const params = new URLSearchParams(window.location.search);
    const idUsuario = params.get("id");

    if (!idUsuario) {
      window.location.href = "../html/login.html";
    }
  }

  mostraNomeUsuario();

  function mostraNomeUsuario() {
    const nomeUsuario = localStorage.getItem("nomeUsuario");
    document.getElementById("nome-usuario").textContent = nomeUsuario;
  }

  const conteudoPrincipal = document.getElementById("conteudo-principal");
  const links = document.querySelectorAll(".sidebar a");

  // Funçoes de carregamento das paginas html na pagina do cordenador;

  function carregarPaginaHtml(url) {
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

  function selecionarECarregarPagina() {
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const page = link.getAttribute("data-page");
        carregarPaginaHtml(page);
      });
    });
  }

  selecionarECarregarPagina();
  carregarPaginaHtml("html/dashboard.html");
});
