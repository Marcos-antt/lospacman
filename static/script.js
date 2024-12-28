document.getElementById("betForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const fighter = document.getElementById("fighter").value;
    const amount = document.getElementById("amount").value;

    try {
        const response = await fetch("/bet", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, fighter, amount }),
        });

        const result = await response.json();
        if (response.ok) {
            // Exibe mensagem de sucesso
            showPopup(`Aposta registrada com sucesso! Número do pedido: ${result.order_number}`);

            // Limpa o formulário
            document.getElementById("betForm").reset();
        } else {
            // Exibe mensagem de erro
            showPopup(result.message, true);
        }
    } catch (error) {
        showPopup("Erro ao registrar a aposta.", true);
        console.error(error);
    }
});

function showPopup(message, isError = false) {
    const popup = document.getElementById("popup-message");
    popup.textContent = message; // Define a mensagem

    // Aplica estilo de sucesso ou erro
    if (isError) {
        popup.classList.add("error");
    } else {
        popup.classList.remove("error");
    }

    // Mostra o popup
    popup.classList.remove("hidden");
    popup.classList.add("show");

    // Remove o popup após 3 segundos
    setTimeout(() => {
        popup.classList.remove("show");
        setTimeout(() => popup.classList.add("hidden"), 500); // Esconde após a animação
    }, 3000);
}

// Acessar o Dashboard
document.getElementById("accessDashboard").addEventListener("click", function () {
    const password = document.getElementById("dashboardPassword").value;

    if (password) {
        // Redireciona para a rota do dashboard com a senha como parâmetro
        window.location.href = `/dashboard?password=${password}`;
    } else {
        alert("Por favor, insira a senha para acessar o dashboard.");
    }
});

// Adiciona evento a todos os botões de valor
document.querySelectorAll(".value-btn").forEach(button => {
    button.addEventListener("click", function () {
        const value = this.getAttribute("data-value");
        document.getElementById("amount").value = value; // Define o valor no campo de entrada
    });
});

