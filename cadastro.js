var cadastroForm = document.getElementById('cadastroForm');
var successMessage = document.getElementById('successMessage');
var errorMessage = document.getElementById('errorMessage');

function mostrarMensagem(tipo, texto) {
    var mensagemAtual = tipo === 'success' ? successMessage : errorMessage;
    var outraMensagem = tipo === 'success' ? errorMessage : successMessage;

    mensagemAtual.textContent = texto;
    mensagemAtual.style.display = 'block';
    outraMensagem.style.display = 'none';

    setTimeout(function() {
        mensagemAtual.style.display = 'none';
    }, 5000);
}

cadastroForm.addEventListener('submit', function(evento) {
    evento.preventDefault();

    var nome = document.getElementById('nome').value.trim();
    var email = document.getElementById('email').value.trim();
    var telefone = document.getElementById('telefone').value.trim();
    var senha = document.getElementById('senha').value;
    var confirmarSenha = document.getElementById('confirmarSenha').value;
    var termos = document.getElementById('termos').checked;

    if (!nome || !email || !senha || !confirmarSenha || !termos) {
        mostrarMensagem('error', 'Preencha todos os campos obrigatorios.');
        return;
    }

    if (senha.length < 6) {
        mostrarMensagem('error', 'A senha precisa ter pelo menos 6 caracteres.');
        return;
    }

    if (senha !== confirmarSenha) {
        mostrarMensagem('error', 'As senhas nao conferem.');
        return;
    }

    var usuario = {
        nome: nome,
        email: email,
        telefone: telefone,
        password: senha
    };

    fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
    })
    .then(function(response) {
        return response.json().then(function(data) {
            return {
                ok: response.ok,
                data: data
            };
        });
    })
    .then(function(resultado) {
        if (!resultado.ok) {
            mostrarMensagem('error', resultado.data.message || 'Erro ao cadastrar usuario.');
            return;
        }

        localStorage.setItem('playZoneToken', resultado.data.token);

        cadastroForm.reset();
        mostrarMensagem('success', 'Cadastro realizado com sucesso!');

        setTimeout(function() {
            window.location.href = 'loguin.html';
        }, 1500);
    })
    .catch(function() {
        mostrarMensagem('error', 'Nao foi possivel conectar ao servidor.');
    });
});