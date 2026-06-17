document.addEventListener('DOMContentLoaded', () => {
  const cepInput = document.getElementById('cep');
  const addressForm = document.getElementById('addressForm');

  // Máscara de CEP e Busca Automática
  cepInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 5) value = value.replace(/^(\d{5})(\d)/, '$1-$2');
      e.target.value = value;

      if (value.length === 9) {
          buscarCEP(value.replace('-', ''));
      }
  });

  async function buscarCEP(cep) {
      try {
          addressForm.classList.add('loading');
          const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          const data = await response.json();

          if (!data.erro) {
              document.getElementById('rua').value = data.logradouro;
              document.getElementById('bairro').value = data.bairro;
              document.getElementById('cidade').value = data.localidade;
              document.getElementById('estado').value = data.uf;
              document.getElementById('numero').focus();
          }
      } catch (error) {
          console.error('Erro ao buscar CEP:', error);
      } finally {
          addressForm.classList.remove('loading');
      }
  }

  addressForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Endereço cadastrado com sucesso!');
  });
});
