function excluirSelecionados(idsParaExcluir) {
  if (idsParaExcluir.length === 0) {
    alert("Nenhum item selecionado para exclusão.");
    return;
  }

  if (!confirm(`Tem certeza que deseja excluir ${idsParaExcluir.length} item(ns) selecionado(s)?`)) {
    return;
  }

  var lista = JSON.parse(localStorage.getItem("listaClientes"));

  const novaLista = lista.filter((item) => {
    return !idsParaExcluir.includes(String(item.id));
  });

  localStorage.setItem("listaClientes", JSON.stringify(novaLista));
  carregaItens();
}

export function selecionaItenASerExcluido() {
  conteudoPrincipal.addEventListener("click", (e) => {
    if (e.target.id === "btn-excluir-selecionados") {
      e.preventDefault();

      const listaAmbulanciasDiv = document.getElementById("listaAmbulancias");
      if (!listaAmbulanciasDiv) return;

      const checkboxesMarcadas = listaAmbulanciasDiv.querySelectorAll(".item-para-excluir:checked");

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

    return (
      item.nome.toLowerCase().includes(termo) ||
      item.cpf.includes(termo) ||
      item.placa.toLowerCase().includes(termo) ||
      idString.includes(termo)
    );
  });
}

export function carregaItens(searchTerm = "") {
  const listaAmbulanciaDiv = document.getElementById("listaAmbulancias");

  if (!listaAmbulanciaDiv) {
    return;
  }

  if (localStorage.getItem("listaClientes")) {
    var listaCompleta = JSON.parse(localStorage.getItem("listaClientes"));
    var listaFiltrada = aplicarFiltro(listaCompleta, searchTerm);
    var html = "";

    html += "<table>";
    html += "<tr>";
    html += "<td></td>";
    html += "<td>ID</td>";
    html += "<td>Nome do motorista</td>";
    html += "<td>CPF</td>";
    html += "<td>CNH</td>";
    html += "<td>Placa</td>";
    html += "<td>Status</td>";
    html += "</tr>";

    for (var i = 0; i < listaFiltrada.length; i++) {
      html += "<tr>";
      html += `<td><div class="input-checkbox"><input type="checkbox" class="item-para-excluir" data-id="${listaFiltrada[i].id}"></div></td>`;
      html += "<td>" + listaFiltrada[i].id + "</td>";
      html += "<td>" + listaFiltrada[i].nome + "</td>";
      html += "<td>" + listaFiltrada[i].cpf + "</td>";
      html += "<td>" + listaFiltrada[i].cnh + "</td>";
      html += "<td>" + listaFiltrada[i].placa + "</td>";
      html += "<td>" + listaFiltrada[i].status + "</td>";
      html += "</tr>";
    }

    html += "</table>";
    listaAmbulanciaDiv.innerHTML = html;
  } else {
    var obj = {id: 1, nome: "teste", cpf: "11174448997", cnh: "11111111", placa: "09999999", status: "Em operação"};
    var lista = [];
    lista.push(obj);
    localStorage.setItem("listaClientes", JSON.stringify(lista));
    carregaItens();
  }
}

export function adicionaListenerDeBusca() {
  conteudoPrincipal.addEventListener("keyup", (e) => {
    if (e.target.id === "input-busca-ambulancias") {
      carregaItens(e.target.value);
    }
  });
}
