/* funcoes importadas */
import {gerarProximoId} from "../../js/script.js";

const CHAVE_FUNCIONARIOS = "listaFuncionarios";
const conteudoPrincipal = document.getElementById("conteudoPrincipal");

// --- Função para mostrar a notificação customizada ---
function mostrarNotificacao(mensagem) {
  const notificacao = document.getElementById("notificacao-toast");
  const mensagemEl = document.getElementById("notificacao-mensagem");

  if (notificacao && mensagemEl) {
    mensagemEl.textContent = mensagem;
    notificacao.classList.add("show");

    // Esconde a notificação depois de 5 segundos
    setTimeout(() => {
      notificacao.classList.remove("show");
    }, 5000);
  }
}

// --- Funções de Exclusão (DELETE) ---
export function excluirSelecionados(idsParaExcluir) {
    if (idsParaExcluir.length === 0) {
      // Usando a notificação customizada no lugar do alert
      mostrarNotificacao("Nenhum funcionário selecionado para exclusão.");
      return;
    }

    if (!confirm(`Tem certeza que deseja excluir ${idsParaExcluir.length} item(ns) selecionado(s)?`)) {
      return;
    } 

    var lista = JSON.parse(localStorage.getItem(CHAVE_FUNCIONARIOS)) || []; 
    const novaLista = lista.filter((item) => {
      return !idsParaExcluir.includes(String(item.id));
    });

    localStorage.setItem(CHAVE_FUNCIONARIOS, JSON.stringify(novaLista));
    carregaItens(); 
}

export function selecionaItenASerExcluido() {
    conteudoPrincipal.addEventListener("click", (e) => {
      if (e.target.id === "btn-excluir-selecionados-func") {
        e.preventDefault();
        const listaFuncionariosDiv = document.getElementById("listaFuncionarios");
        if (!listaFuncionariosDiv) return;

        const checkboxesMarcadas = listaFuncionariosDiv.querySelectorAll(".item-para-excluir-func:checked");
        const idsParaExcluir = Array.from(checkboxesMarcadas).map(cb => cb.getAttribute("data-id"));
        
        excluirSelecionados(idsParaExcluir);
      }
    });
}

// --- Funções de Busca (Filtro) ---
export function aplicarFiltro(listaCompleta, searchTerm) {
    if (!searchTerm || searchTerm.trim() === "") {
      return listaCompleta;
    }
    const termo = searchTerm.toLowerCase().trim();
    return listaCompleta.filter((item) => {
      return (
        String(item.id).includes(termo) ||
        item.nome.toLowerCase().includes(termo) ||
        item.cpf.includes(termo) ||
        item.cargo.toLowerCase().includes(termo)
      );
    });
}

export function adicionaListenerDeBusca() {
    conteudoPrincipal.addEventListener("keyup", (e) => {
      if (e.target.id === "input-busca-funcionarios") {
        carregaItens(e.target.value);
      }
    });
}

// --- Funções de Armazenamento e Atualização (CREATE / UPDATE) ---
function resetarModalFuncionario() {
    const form = document.getElementById("form-cadastro-funcionario");
    if (form) form.reset();
  
    const modal = document.getElementById('modal-funcionario');
    if (modal) {
      document.getElementById("funcionario-edit-id").value = "";
      modal.querySelector('.modal-title').textContent = 'Informações do Funcionário';
      const btnSalvar = document.getElementById('enviar-informacoes-funcionario');
      if (btnSalvar) btnSalvar.textContent = 'Cadastrar';
    }
}

export function gerenciarFormularioFuncionario() {
    conteudoPrincipal.addEventListener("click", (e) => {
      // Lógica para ABRIR O MODAL EM MODO DE EDIÇÃO
      if (e.target.classList.contains("botao-editar")) {
        const id = e.target.getAttribute("data-id");
        const lista = JSON.parse(localStorage.getItem(CHAVE_FUNCIONARIOS)) || [];
        const funcionario = lista.find(item => String(item.id) === id);

        if (funcionario) {
          document.getElementById("funcionario-edit-id").value = funcionario.id;
          document.getElementById("nome-funcionario").value = funcionario.nome;
          document.getElementById("cpf-funcionario").value = funcionario.cpf;
          document.getElementById("cargo-funcionario").value = funcionario.cargo;
          document.getElementById("telefone-funcionario").value = funcionario.telefone;
          document.getElementById("email-funcionario").value = funcionario.email;

          const modalEl = document.getElementById('modal-funcionario');
          modalEl.querySelector('.modal-title').textContent = 'Editar Funcionário';
          document.getElementById('enviar-informacoes-funcionario').textContent = 'Salvar Alterações';

          new bootstrap.Modal(modalEl).show();
        }
      }

      // Lógica para SALVAR (seja criando um novo ou atualizando)
      if (e.target.id === "enviar-informacoes-funcionario") {
        e.preventDefault();

        if (!document.getElementById("nome-funcionario").value || 
            !document.getElementById("cpf-funcionario").value ||
            !document.getElementById("cargo-funcionario").value) {
              alert("Nome, CPF e Cargo são obrigatórios.");
              return;
        }

        const idParaEditar = document.getElementById("funcionario-edit-id").value;
        let lista = JSON.parse(localStorage.getItem(CHAVE_FUNCIONARIOS)) || [];

        if (idParaEditar) { // MODO UPDATE
          const index = lista.findIndex(item => String(item.id) === idParaEditar);
          if (index !== -1) {
            lista[index].nome = document.getElementById("nome-funcionario").value;
            lista[index].cpf = document.getElementById("cpf-funcionario").value;
            lista[index].cargo = document.getElementById("cargo-funcionario").value;
            lista[index].telefone = document.getElementById("telefone-funcionario").value;
            lista[index].email = document.getElementById("email-funcionario").value;
          }
        } else { // MODO CREATE
          const obj = {
            id: gerarProximoId(lista),
            nome: document.getElementById("nome-funcionario").value,
            cpf: document.getElementById("cpf-funcionario").value,
            cargo: document.getElementById("cargo-funcionario").value,
            telefone: document.getElementById("telefone-funcionario").value,
            email: document.getElementById("email-funcionario").value,
          };
          lista.push(obj);
        }

        localStorage.setItem(CHAVE_FUNCIONARIOS, JSON.stringify(lista));
        
        const modalInstancia = bootstrap.Modal.getInstance(document.getElementById('modal-funcionario'));
        if (modalInstancia) modalInstancia.hide();
        
        setTimeout(() => {
          carregaItens();
          resetarModalFuncionario();
        }, 250);
      }

      // Lógica para ABRIR O MODAL EM MODO DE CADASTRO
      if (e.target.matches('[data-bs-target="#modal-funcionario"]')) {
         resetarModalFuncionario();
      }
    });
}

// --- Funções de Carregamento e Renderização (READ) ---
export function carregaItens(searchTerm = "") {
      const listaFuncionariosDiv = document.getElementById("listaFuncionarios");
      if (!listaFuncionariosDiv) return;

      if (!localStorage.getItem(CHAVE_FUNCIONARIOS)) {
          var obj = {id: 1, nome: "Antonio", cpf: "12345678900", cargo: "Coordenador", telefone: "9999-9999", email: "antonio@hospital.com"};
          localStorage.setItem(CHAVE_FUNCIONARIOS, JSON.stringify([obj]));
      }
      
      var listaCompleta = JSON.parse(localStorage.getItem(CHAVE_FUNCIONARIOS)) || [];
      var listaFiltrada = aplicarFiltro(listaCompleta, searchTerm); 
      var html = `
        <table>
          <tr>
            <td></td>
            <td>ID</td>
            <td>Nome</td>
            <td>CPF</td>
            <td>Cargo</td>
            <td>Telefone</td>
            <td>Ações</td>
          </tr>
      `;

      for (const item of listaFiltrada) {
          html += `
            <tr>
              <td><div class="input-checkbox"><input type="checkbox" class="item-para-excluir-func" data-id="${item.id}"></div></td>
              <td>${item.id}</td>
              <td>${item.nome}</td>
              <td>${item.cpf}</td>
              <td>${item.cargo}</td>
              <td>${item.telefone}</td>
              <td><button type="button" class="botao-editar" data-id="${item.id}">Editar</button></td>
            </tr>
          `;
      }

      html += "</table>";
      listaFuncionariosDiv.innerHTML = html;
}
