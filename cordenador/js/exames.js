/* funcoes importadas */

import {gerarProximoId} from "../../js/script.js";

const CHAVE_EXAMES = "listaExamesStorage";
const conteudoPrincipal = document.getElementById("conteudoPrincipal");

function resetarModalExame() {
  const form = document.getElementById("form-cadastro-exame");
  if (form) form.reset();

  const modal = document.getElementById("modal-exame");
  if (modal) {
    document.getElementById("exame-edit-id").value = "";
    modal.querySelector(".modal-title").textContent = "Informações do Exame";
    const btnSalvar = document.getElementById("enviar-informacoes-exame");
    if (btnSalvar) btnSalvar.textContent = "Cadastrar";
  }
}

export function gerenciarFormularioExame() {
  conteudoPrincipal.addEventListener("click", (e) => {
    if (e.target.classList.contains("botao-editar")) {
      const id = e.target.getAttribute("data-id");
      const lista = JSON.parse(localStorage.getItem(CHAVE_EXAMES)) || [];
      const exame = lista.find((item) => String(item.id) === id);

      if (exame) {
        document.getElementById("exame-edit-id").value = exame.id;
        document.getElementById("nome-exame").value = exame.nome;

        const modalEl = document.getElementById("modal-exame");
        modalEl.querySelector(".modal-title").textContent = "Editar Exame";
        document.getElementById("enviar-informacoes-exame").textContent = "Salvar Alterações";
        new bootstrap.Modal(modalEl).show();
      }
    }
    if (e.target.id === "enviar-informacoes-exame") {
      e.preventDefault();

      if (!document.getElementById("nome-exame").value) {
        alert("O Nome do exame é obrigatório.");
        return;
      }

      const idParaEditar = document.getElementById("exame-edit-id").value;
      let lista = JSON.parse(localStorage.getItem(CHAVE_EXAMES)) || [];
      const nomeExame = document.getElementById("nome-exame").value;

      if (idParaEditar) {
        const index = lista.findIndex((item) => String(item.id) === idParaEditar);
        if (index !== -1) {
          lista[index].nome = nomeExame;
        }
      } else {
        const obj = {
          id: gerarProximoId(lista),
          nome: nomeExame,
        };
        lista.push(obj);
      }

      localStorage.setItem(CHAVE_EXAMES, JSON.stringify(lista));

      const modalInstancia = bootstrap.Modal.getInstance(document.getElementById("modal-exame"));
      if (modalInstancia) modalInstancia.hide();
      setTimeout(() => {
        carregaItens();
        resetarModalExame();
      }, 250);
    }

    if (e.target.matches('[data-bs-target="#modal-exame"]')) {
      resetarModalExame();
    }
  });
}


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

  // Adicionando inicialização de lista se não existir, igual ao seu código de funcionário
  if (!localStorage.getItem(CHAVE_EXAMES)) {
    var obj = {id: 1, nome: "Hemograma"};
    localStorage.setItem(CHAVE_EXAMES, JSON.stringify([obj]));
  }

  var listaCompleta = JSON.parse(localStorage.getItem(CHAVE_EXAMES));
  var listaFiltrada = aplicarFiltro(listaCompleta, searchTerm);
  var html = "";

  html += "<table>";
  html += "<tr>";
  html += "<td></td>";
  html += "<td>ID</td>";
  html += "<td>Nome do exame</td>";
  html += "<td>Ações</td>";
  html += "</tr>";

  for (var i = 0; i < listaFiltrada.length; i++) {
    html += "<tr>";
    html += `<td><div class="input-checkbox"><input type="checkbox" class="item-para-excluir" data-id="${listaFiltrada[i].id}"></div></td>`;
    html += "<td>" + listaFiltrada[i].id + "</td>";
    html += "<td>" + listaFiltrada[i].nome + "</td>";
    html += `<td><button type="button" class="botao-editar" data-id="${listaFiltrada[i].id}"></button></td>`;
    html += "</tr>";
  }

  html += "</table>";
  listaExamesDiv.innerHTML = html;
}

export function adicionaListenerDeBusca() {
  conteudoPrincipal.addEventListener("keyup", (e) => {
    if (e.target.id === "input-busca-exame") {
      carregaItens(e.target.value);
    }
  });
}

