/* funcoes importadas */

import {gerarProximoId} from "../../js/script.js";
import {carregarPaginaHtml} from "../cordenador.js";

function excluirSelecionados(idsParaExcluir) {
  if (idsParaExcluir.length === 0) {
    alert("Nenhum item selecionado para exclusão.");
    return;
  }

  if (!confirm(`Tem certeza que deseja excluir ${idsParaExcluir.length} item(ns) selecionado(s)?`)) {
    return;
  }

  var lista = JSON.parse(localStorage.getItem("listaExamesStorage"));

  const novaLista = lista.filter((item) => {
    return !idsParaExcluir.includes(String(item.id));
  });

  localStorage.setItem("listaExamesStorage", JSON.stringify(novaLista));
  carregaItens();
}

export function selecionaItenASerExcluido() {
  conteudoPrincipal.addEventListener("click", (e) => {
    if (e.target.id === "btn-excluir-selecionados") {
      e.preventDefault();

      const listaExamesDiv = document.getElementById("listaExames");
      if (!listaExamesDiv) return;

      const checkboxesMarcadas = listaExamesDiv.querySelectorAll(".item-para-excluir:checked");

      const idsParaExcluir = [];

      checkboxesMarcadas.forEach((checkbox) => {
        const id = checkbox.getAttribute("data-id");
        if (id !== null) {
          idsParaExcluir.push(id);
        }
      });

      excluirSelecionados(idsParaExcluir);
    }
  });
}

function aplicarFiltro(listaCompleta, searchTerm) {
  if (!searchTerm || searchTerm.trim() === "") {
    return listaCompleta;
  }

  const termo = searchTerm.toLowerCase().trim();

  return listaCompleta.filter((item) => {
    const idString = String(item.id);

    return item.nome.toLowerCase().includes(termo) || idString.includes(termo);
  });
}

export function carregaItens(searchTerm = "") {
  const listaExamesDiv = document.getElementById("listaExames");

  if (!listaExamesDiv) {
    return;
  }

  if (localStorage.getItem("listaExamesStorage")) {
    var listaCompleta = JSON.parse(localStorage.getItem("listaExamesStorage"));
    var listaFiltrada = aplicarFiltro(listaCompleta, searchTerm);
    var html = "";

    html += "<table>";
    html += "<tr>";
    html += "<td></td>";
    html += "<td>ID</td>";
    html += "<td>Nome do exame</td>";
    html += "</tr>";

    for (var i = 0; i < listaFiltrada.length; i++) {
      html += "<tr>";
      html += `<td><div class="input-checkbox"><input type="checkbox" class="item-para-excluir" data-id="${listaFiltrada[i].id}"></div></td>`;
      html += "<td>" + listaFiltrada[i].id + "</td>";
      html += "<td>" + listaFiltrada[i].nome + "</td>";
      html += "</tr>";
    }

    html += "</table>";
    listaExamesDiv.innerHTML = html;
  } else {
    var obj = {id: 1, nome: "teste"};
    var lista = [];
    lista.push(obj);
    localStorage.setItem("listaExamesStorage", JSON.stringify(lista));
    carregaItens();
  }
}

export function adicionaListenerDeBusca() {
  conteudoPrincipal.addEventListener("keyup", (e) => {
    if (e.target.id === "input-busca-exame") {
      carregaItens(e.target.value);
    }
  });
}

function armazenar() {
  var listaClientes = JSON.parse(localStorage.getItem("listaExamesStorage"));
  const novoId = gerarProximoId(listaClientes);

  var obj = {id: novoId, nome: ""};
  obj.nome = document.getElementById("nome-exame").value;
  listaClientes.push(obj);
  localStorage.setItem("listaExamesStorage", JSON.stringify(listaClientes));
}

export function cadastrarExames() {
  conteudoPrincipal.addEventListener("click", (e) => {
    if (e.target.id === "enviar-informacoes-exame") {
      e.preventDefault();

      armazenar();
      carregarPaginaHtml("html/exames.html");
    }
  });
}
