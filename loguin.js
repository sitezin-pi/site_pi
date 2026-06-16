const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");
const params = new URLSearchParams(window.location.search);
const nextPage = params.get("next") || localStorage.getItem("checkout_redirect") || "index.html";

const cadastroLink = document.querySelector('a[href="cadastro.html"]');
if (cadastroLink) {
  cadastroLink.href = `cadastro.html?next=${encodeURIComponent(nextPage)}`;
  cadastroLink.removeAttribute("target");
  cadastroLink.removeAttribute("rel");
}

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
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
      message.textContent = data.message || "E-mail ou senha invalidos.";
      message.className = "error";
      return;
    }

    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    message.textContent = "Login realizado com sucesso!";
    message.className = "success";

    console.log("Usuario autenticado:", data);

    setTimeout(function () {
      localStorage.removeItem("checkout_redirect");
      window.location.href = nextPage;
    }, 1000);

  } catch (error) {
    console.error("Erro ao fazer login:", error);

    message.textContent = "Erro ao conectar com o servidor.";
    message.className = "error";
  }
});
