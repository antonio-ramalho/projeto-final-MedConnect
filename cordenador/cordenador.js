/* funcoes importadas do script.js*/

import {verificaExistenciaModal} from "../js/script.js";

/* funcoes da ambulancia.js*/

import {selecionaItenASerExcluido} from "./js/ambulancia.js";
import {carregaItens} from "./js/ambulancia.js";
import {adicionaListenerDeBusca} from "./js/ambulancia.js";
import {cadastrarAmbulancia} from "./js/ambulancia.js";

/* funcoes do cordenador*/

function verSeEstaLogado() {
  const params = new URLSearchParams(window.location.search);
  const idUsuario = params.get("id");

  if (!idUsuario) {
    window.location.href = "../html/login.html";
  }
}

function mostraNomeUsuario() {
  const nomeUsuario = localStorage.getItem("nomeUsuario");
  document.getElementById("nome-usuario").textContent = nomeUsuario;
}

const conteudoPrincipal = document.getElementById("conteudoPrincipal");
const links = document.querySelectorAll(".sidebar a");

export function carregarPaginaHtml(url) {
  verificaExistenciaModal();

  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      conteudoPrincipal.innerHTML = html;

      if (url === "html/ambulancias.html") {
        carregaItens();
      }
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
      gerenciarEstadoAtivo(link);
      const page = link.getAttribute("data-page");
      carregarPaginaHtml(page);
    });
  });
}

function gerenciarEstadoAtivo(linkAtivo) {
  links.forEach((link) => {
    link.classList.remove("ativo");
  });

  if (linkAtivo) {
    linkAtivo.classList.add("ativo");
  }
}

/* loop principal */

document.addEventListener("DOMContentLoaded", () => {
  verSeEstaLogado();
  mostraNomeUsuario();
  carregarPaginaHtml("html/dashboard.html");
  selecionarECarregarPagina();
  selecionaItenASerExcluido();
  cadastrarAmbulancia();
  adicionaListenerDeBusca();
});
