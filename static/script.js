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


function countdownToNewYear() {
    const now = new Date();
    const nextYear = now.getFullYear() + 1;
    const newYear = new Date(`January 1, ${nextYear} 00:00:00`).getTime();

    const emergencyButton = document.getElementById("emergencyButton");

    emergencyButton.disabled = true;
    emergencyButton.style.cursor = "not-allowed";
    emergencyButton.textContent = "Chave de Emergência...";

    const interval = setInterval(() => {
        const currentTime = new Date().getTime();
        const timeLeft = newYear - currentTime;

        if (timeLeft <= 0) {
            clearInterval(interval);

            document.getElementById("days").innerText = "00";
            document.getElementById("hours").innerText = "00";
            document.getElementById("minutes").innerText = "00";
            document.getElementById("seconds").innerText = "00";

            emergencyButton.disabled = false;
            emergencyButton.classList.add("active");
            emergencyButton.textContent = "Ativar Emergência";
            emergencyButton.style.cursor = "pointer";

 
            emergencyButton.addEventListener("click", () => {
                window.location.href = "https://www.google.com.br/"; //linkkkkkkk
            });
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = days < 10 ? "0" + days : days;
        document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
        document.getElementById("minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
        document.getElementById("seconds").innerText = seconds < 10 ? "0" + seconds : seconds;
    }, 1000);
}

countdownToNewYear();
