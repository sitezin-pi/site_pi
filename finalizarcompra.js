document.addEventListener('DOMContentLoaded', () => {
    // Gerar um número de pedido aleatório
    const orderIdElement = document.getElementById('order-id');
    if (orderIdElement) {
        orderIdElement.innerText = '#' + Math.floor(Math.random() * 100000000);
    }
    
    // Data atual formatada
    const orderDateElement = document.getElementById('order-date');
    if (orderDateElement) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        orderDateElement.innerText = new Date().toLocaleDateString('pt-BR', options);
    }

    const orderTotalElement = document.getElementById('order-total');
    if (orderTotalElement) {
        const checkoutSummary = getCheckoutSummary();
        orderTotalElement.innerText = formatBRL(checkoutSummary?.final ?? 0);
    }

    // Efeito de confete
    createConfetti();
});

function getCheckoutSummary() {
    try {
        const raw = localStorage.getItem('checkout_summary_v1');
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function formatBRL(value) {
    try {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(Number(value) || 0);
    } catch {
        return `R$ ${(Number(value) || 0).toFixed(2).replace('.', ',')}`;
    }
}

function createConfetti() {
    const colors = ['#4CAF50', '#2196F3', '#FFC107', '#FF5722', '#E91E63'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Posição horizontal aleatória
        confetti.style.left = Math.random() * 100 + 'vw';
        
        // Cor aleatória do array
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Duração e atraso aleatórios para naturalidade
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 2;
        
        confetti.style.animation = `fall ${duration}s linear ${delay}s forwards`;
        confetti.style.opacity = Math.random();
        
        document.body.appendChild(confetti);
        
        // Remover o elemento após a animação para não sobrecarregar o DOM
        setTimeout(() => {
            confetti.remove();
        }, (duration + delay) * 1000);


       
    }
}
