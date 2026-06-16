const formEndereco = document.getElementById("formEndereco");

formEndereco.addEventListener("submit", function (event) {
  event.preventDefault();

  const endereco = {
    cep: document.getElementById("cep").value,
    rua: document.getElementById("rua").value,
    numero: document.getElementById("numero").value,
    complemento: document.getElementById("complemento").value,
    bairro: document.getElementById("bairro").value,
    cidade: document.getElementById("cidade").value,
    estado: document.getElementById("estado").value
  };

  console.log(endereco);

  // Aqui depois você pode mandar para:
  // pagamento.html
  // resumo.html
  // pedido.html

  window.location.href = "pagamento.html";
});