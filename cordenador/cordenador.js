/* funcoes importadas do script.js*/

import {gerarProximoId} from "../js/script.js";
import {verificaExistenciaModal} from "../js/script.js";

/* funcoes da ambulancia.js*/

import {selecionaItenASerExcluido} from "./js/ambulancia.js";
import {carregaItens} from "./js/ambulancia.js";
import {adicionaListenerDeBusca} from "./js/ambulancia.js";

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

function carregarPaginaHtml(url) {
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

/* funcoes hub da ambulancia */

function armazenar() {
  var listaClientes = JSON.parse(localStorage.getItem("listaClientes"));
  const novoId = gerarProximoId(listaClientes);

  var obj = {id: novoId, nome: "", cpf: "", cnh: "", placa: "", status: "Em operação"};
  obj.nome = document.getElementById("nome-motorista").value;
  obj.cpf = document.getElementById("cpf-motorista").value;
  obj.cnh = document.getElementById("cnh-motorista").value;
  obj.placa = document.getElementById("placa-ambu").value;
  listaClientes.push(obj);
  localStorage.setItem("listaClientes", JSON.stringify(listaClientes));
}

function cadastrarAmbulancia() {
  conteudoPrincipal.addEventListener("click", (e) => {
    if (e.target.id === "enviar-informacoes-motorista") {
      e.preventDefault();

      armazenar();
      carregarPaginaHtml("html/ambulancias.html");
    }
  });
}

/* loop principal */

document.addEventListener("DOMContentLoaded", () => {
  verSeEstaLogado();
  mostraNomeUsuario();
  selecionarECarregarPagina();
  carregarPaginaHtml("html/dashboard.html");
  selecionaItenASerExcluido();
  cadastrarAmbulancia();
  adicionaListenerDeBusca();
});
