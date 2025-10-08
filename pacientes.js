// cordenador/js/pacientes.js

// --- INÍCIO DAS ALTERAÇÕES ---

// Função para carregar os dados do localStorage ou usar os dados iniciais
function carregarDados() {
  const dadosSalvos = localStorage.getItem('pacientes_db');
  // Se houver dados salvos, use-os. Senão, use a lista inicial.
  if (dadosSalvos) {
    return JSON.parse(dadosSalvos);
  } else {
    return [
      {
        id: 1,
        nome: "Antonio Ferreira Ramalho",
        endereco: "Vila Brasília, 70",
        cpf: "11174448997",
        matricula: "705496046854",
      },
      {
        id: 2,
        nome: "Maria Oliveira Santos",
        endereco: "Rua das Flores, 123",
        cpf: "22233344455",
        matricula: "806547123987",
      },
      {
        id: 3,
        nome: "João Pedro Costa",
        endereco: "Avenida Principal, 456",
        cpf: "66677788899",
        matricula: "907654321456",
      },
    ];
  }
}

// Função para salvar os dados no localStorage
function salvarDados() {
  // JSON.stringify converte nosso array de objetos para uma string, que é como o localStorage salva os dados.
  localStorage.setItem('pacientes_db', JSON.stringify(pacientes));
}

let pacientes = carregarDados();
// Calcula o próximo ID com base no maior ID existente para evitar repetições
let proximoId = pacientes.length > 0 ? Math.max(...pacientes.map(p => p.id)) + 1 : 1;

// --- FIM DAS ALTERAÇÕES ---


// READ: Função para carregar e renderizar os itens na tabela
export function carregaItens(dados = pacientes) {
  const corpoTabela = document.getElementById("tabela-pacientes-corpo");
  if (!corpoTabela) return;

  corpoTabela.innerHTML = ""; // Limpa a tabela antes de recarregar
  dados.forEach((paciente) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${paciente.id}</td>
      <td>${paciente.nome}</td>
      <td>${paciente.endereco}</td>
      <td>${paciente.cpf}</td>
      <td>${paciente.matricula}</td>
      <td class="acoes-botoes">
        <button class="btn-editar" data-id="${paciente.id}" title="Editar"><i class="bi bi-pencil"></i></button>
        <button class="btn-excluir" data-id="${paciente.id}" title="Excluir"><i class="bi bi-trash"></i></button>
      </td>
    `;
    corpoTabela.appendChild(tr);
  });
}

// CREATE & UPDATE: Gerencia o formulário para criar e editar pacientes
export function gerenciarFormularioPaciente() {
  const form = document.getElementById("form-paciente");
  const modalEl = document.getElementById("pacienteModal");
  if (!form || !modalEl) return;

  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  const tituloModal = document.getElementById("pacienteModalLabel");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const pacienteId = document.getElementById("pacienteId").value;
    const nome = document.getElementById("nome-paciente").value;
    const endereco = document.getElementById("endereco-paciente").value;
    const cpf = document.getElementById("cpf-paciente").value;
    const matricula = document.getElementById("matricula-paciente").value;

    if (pacienteId) {
      // UPDATE
      const index = pacientes.findIndex((p) => p.id == pacienteId);
      if (index !== -1) {
        pacientes[index] = { id: parseInt(pacienteId), nome, endereco, cpf, matricula };
      }
    } else {
      // CREATE
      const novoPaciente = { id: proximoId++, nome, endereco, cpf, matricula };
      pacientes.push(novoPaciente);
    }

    salvarDados(); // << ALTERAÇÃO: Salva os dados após criar ou editar
    form.reset();
    document.getElementById("pacienteId").value = "";
    modal.hide();
    carregaItens();
  });

  // Limpa o formulário ao abrir o modal para um novo cadastro
  modalEl.addEventListener("show.bs.modal", (event) => {
      const button = event.relatedTarget;
      if (button && !button.classList.contains('btn-editar')) {
          tituloModal.textContent = 'Cadastrar Paciente';
          form.reset();
          document.getElementById('pacienteId').value = '';
      }
  });
}

// DELETE & PREPARE UPDATE: Adiciona listeners para os botões de ação
export function selecionaItenASerExcluidoPac() {
  document.addEventListener("click", (e) => {
    const target = e.target.closest(".btn-excluir");
    if (target) {
      const id = target.getAttribute("data-id");
      if (confirm("Tem certeza que deseja excluir este paciente?")) {
        pacientes = pacientes.filter((p) => p.id != id);
        salvarDados(); // << ALTERAÇÃO: Salva os dados após excluir
        carregaItens();
      }
    }

    const editTarget = e.target.closest(".btn-editar");
    if (editTarget) {
      const modalEl = document.getElementById("pacienteModal");
      if(!modalEl) return;
      
      const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      const tituloModal = document.getElementById("pacienteModalLabel");
      const id = editTarget.getAttribute("data-id");
      const paciente = pacientes.find((p) => p.id == id);
      
      if (paciente) {
        document.getElementById("pacienteId").value = paciente.id;
        document.getElementById("nome-paciente").value = paciente.nome;
        document.getElementById("endereco-paciente").value = paciente.endereco;
        document.getElementById("cpf-paciente").value = paciente.cpf;
        document.getElementById("matricula-paciente").value = paciente.matricula;
        tituloModal.textContent = 'Editar Paciente';
        modal.show();
      }
    }
  });
}

// SEARCH: Adiciona o listener para a barra de busca
export function adicionaListenerDeBuscaPac() {
  const inputBusca = document.getElementById("busca-paciente");
  if (!inputBusca) return;

  inputBusca.addEventListener("input", (e) => {
    const termo = e.target.value.toLowerCase();
    const pacientesFiltrados = pacientes.filter(
      (p) =>
        p.nome.toLowerCase().includes(termo) ||
        p.cpf.toLowerCase().includes(termo)
    );
    carregaItens(pacientesFiltrados);
  });
}