/* funcoes importadas do script.js*/
import {verificaExistenciaModal} from "../js/script.js";

/* funcoes da ambulancia.js*/
import {selecionaItenASerExcluido} from "./js/ambulancia.js";
import {carregaItens} from "./js/ambulancia.js";
import {adicionaListenerDeBusca} from "./js/ambulancia.js";
import {cadastrarAmbulancia} from "./js/ambulancia.js";

/* Funções de Funcionários */
import {selecionaItenASerExcluido as selecionaItenASerExcluidoFunc} from "./js/funcionarios.js";
import {carregaItens as carregaFuncionarios} from "./js/funcionarios.js";
import {gerenciarFormularioFuncionario} from "./js/funcionarios.js";
import {adicionaListenerDeBusca as adicionaListenerDeBuscaFunc} from "./js/funcionarios.js";

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
  if (nomeUsuario) {
    document.getElementById("nome-usuario").textContent = nomeUsuario;
  }
}

const conteudoPrincipal = document.getElementById("conteudoPrincipal");
const links = document.querySelectorAll(".sidebar a");

export function carregarPaginaHtml(url) {
  verificaExistenciaModal();
  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      conteudoPrincipal.innerHTML = html;
      if (url.includes("ambulancias.html")) {
        carregaItens(); // Função de ambulancia.js
      } else if (url.includes("funcionarios.html")) {
        carregaFuncionarios(); // Alias para a função carregaItens de funcionarios.js
      }
    })
    .catch((error) => {
      console.error("Erro ao carregar a página:", error);
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

  const linkAtivoInicial = document.querySelector(".sidebar a.ativo");
  if (linkAtivoInicial) {
    carregarPaginaHtml(linkAtivoInicial.getAttribute("data-page"));
  } else {
    carregarPaginaHtml("html/dashboard.html"); 
  }
}

function gerenciarEstadoAtivo(linkAtivo) {
  links.forEach((link) => link.classList.remove("ativo"));
  if (linkAtivo) linkAtivo.classList.add("ativo");
}

/* loop principal - ATIVAÇÃO DE TODAS AS FUNÇÕES */
document.addEventListener("DOMContentLoaded", () => {
  verSeEstaLogado();
  mostraNomeUsuario();
  selecionarECarregarPagina();
  
  // FUNÇÕES ATIVADAS PARA AMBULÂNCIA
  selecionaItenASerExcluido();
  cadastrarAmbulancia(); // <-- A CORREÇÃO ESTÁ AQUI
  adicionaListenerDeBusca();
  
  // FUNÇÕES ATIVADAS PARA FUNCIONÁRIOS
  selecionaItenASerExcluidoFunc(); 
  gerenciarFormularioFuncionario();
  adicionaListenerDeBuscaFunc();
});