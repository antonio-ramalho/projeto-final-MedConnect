/* funcoes importadas do script.js*/
import { verificaExistenciaModal } from "../js/script.js";

/* funcoes da ambulancia.js*/
import { selecionaItenASerExcluido } from "./js/ambulancia.js";
import { carregaItens } from "./js/ambulancia.js";
import { adicionaListenerDeBusca } from "./js/ambulancia.js";
import { cadastrarAmbulancia } from "./js/ambulancia.js";

/* Funções de Funcionários */
import { selecionaItenASerExcluido as selecionaItenASerExcluidoFunc } from "./js/funcionarios.js";
import { carregaItens as carregaFuncionarios } from "./js/funcionarios.js";
import { gerenciarFormularioFuncionario } from "./js/funcionarios.js";
import { adicionaListenerDeBusca as adicionaListenerDeBuscaFunc } from "./js/funcionarios.js";

/* Funções de exames */
import { selecionaItenASerExcluido as selecionaItenASerExcluidoExam } from "./js/exames.js";
import { adicionaListenerDeBusca as adicionaListenerDeBuscaExam } from "./js/exames.js";
import { cadastrarExames } from "./js/exames.js";
import { carregaItens as carregaItensExam } from "./js/exames.js";

/* Funções de medicamentos */
import { selecionaItenASerExcluido as selecionaItenASerExcluidoMed } from "./js/medicamentos.js";
import { adicionaListenerDeBusca as adicionaListenerDeBuscaMed } from "./js/medicamentos.js";
import { cadastrarMedicamentos } from "./js/medicamentos.js";
import { carregaItens as carregaItensMed } from "./js/medicamentos.js";

/* Funções de pacientes */
import { selecionaItenASerExcluidoPac } from "./js/pacientes.js";
import { adicionaListenerDeBuscaPac } from "./js/pacientes.js";
import { carregaItens as carregaItensPac } from "./js/pacientes.js"; // Importado como carregaItensPac
import { gerenciarFormularioPaciente } from "./js/pacientes.js";

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
        carregaItens();
      } else if (url.includes("funcionarios.html")) {
        carregaFuncionarios();
      } else if (url.includes("exames.html")) {
        carregaItensExam();
      } else if (url.includes("medicamentos.html")) {
        carregaItensMed();
      } else if (url.includes("pacientes.html")) {
        // CORREÇÃO 1: Chamando a função com o nome correto 'carregaItensPac'
        carregaItensPac(); 
        gerenciarFormularioPaciente();
        selecionaItenASerExcluidoPac();
        adicionaListenerDeBuscaPac();
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

/* loop principal */
document.addEventListener("DOMContentLoaded", () => {
  verSeEstaLogado();
  mostraNomeUsuario();
  selecionarECarregarPagina();

  // FUNÇÕES ATIVADAS PARA AMBULÂNCIA
  selecionaItenASerExcluido();
  cadastrarAmbulancia();
  adicionaListenerDeBusca();

  // FUNÇÕES ATIVADAS PARA FUNCIONÁRIOS
  selecionaItenASerExcluidoFunc();
  gerenciarFormularioFuncionario();
  adicionaListenerDeBuscaFunc();

  // FUNÇÕES ATIVADAS PARA EXAMES
  selecionaItenASerExcluidoExam();
  cadastrarExames();
  adicionaListenerDeBuscaExam();

  // FUNÇÕES ATIVADAS PARA MEDICAMENTOS
  selecionaItenASerExcluidoMed();
  cadastrarMedicamentos();
  adicionaListenerDeBuscaMed();

  // CORREÇÃO 2: As funções de pacientes foram removidas daqui para serem chamadas apenas quando a página de pacientes for carregada.
});