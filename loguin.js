const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

function getLoginRedirect() {
  const params = new URLSearchParams(window.location.search);
  const next = params.get("next") || localStorage.getItem("checkout_redirect");

  if (next === "carrinho.html") {
    localStorage.removeItem("checkout_redirect");
    return "carrinho.html";
  }

  return "index.html";
}

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const payload = {
    email: email,
    password: password
  };

  try {
    const response = await fetch("http://localhost:3000/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      message.textContent = data.message || "E-mail ou senha inválidos.";
      message.className = "error";
      return;
    } 

    message.textContent = "Login realizado com sucesso!";
    message.className = "success";

    console.log("Usuário autenticado:", data);

    // Exemplo: salvar token, caso sua API retorne um token
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    window.location.href = getLoginRedirect();

    // Exemplo: redirecionar após login
    // window.location.href = "dashboard.html";

  } catch (error) {
    console.error("Erro ao fazer login:", error);

    message.textContent = "Erro ao conectar com o servidor.";
    message.className = "error";
  }
});



