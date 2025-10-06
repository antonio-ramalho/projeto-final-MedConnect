export function gerarProximoId(lista) {
  if (lista.length === 0) {
    return 1;
  }

  const ultimoId = lista[lista.length - 1].id;
  return parseInt(ultimoId) + 1;
}

export function verificaExistenciaModal() {
  const modalElement = document.getElementById("myModal");

  if (modalElement && modalElement.classList.contains("show")) {
    const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    modalInstance.hide();
  }
}
