const lista = document.getElementById('listaReservas');
const selectQuarto = document.getElementById('quarto');
const resultados = document.getElementById('resultados');
const formReservaContainer = document.getElementById('formReservaContainer');

function atualizarQuartosSelect() {
    selectQuarto.innerHTML = '<option value="">Selecione um quarto</option>';
    quartos.forEach(q => {
        selectQuarto.innerHTML += `<option value="${q.id}">${q.id} - ${q.tipo} (${q.preco} €/noite)</option>`;
    });
}

document.getElementById('formBusca').addEventListener('submit', e => {
    e.preventDefault();
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const hospedes = +document.getElementById('hospedes').value;

    const startDate = new Date(checkin);
    const endDate = new Date(checkout);

    if (startDate >= endDate) {
        alert('Data de check-in deve ser anterior à check-out!');
        return;
    }

    const disponiveis = quartos.filter(q => {
        if (q.capacidade < hospedes) return false;
        const overlap = reservas.some(r => r.quartoId === q.id &&
            ((startDate < new Date(r.fim) && endDate > new Date(r.inicio))));
        return !overlap;
    });

    mostrarResultados(disponiveis, checkin, checkout);
});

function mostrarResultados(disponiveis, checkin, checkout) {
    resultados.innerHTML = '<h4 class="mb-3">Quartos Disponíveis</h4>';
    if (disponiveis.length === 0) {
        resultados.innerHTML += '<p>Nenhum quarto disponível para essas datas.</p>';
    } else {
        disponiveis.forEach(q => {
            const template = document.getElementById('cardTemplate');
            const clone = template.content.cloneNode(true);
            const img = clone.querySelector('img');
            img.src = q.imagem;
            img.alt = q.tipo;
            const title = clone.querySelector('.card-title');
            title.textContent = q.tipo;
            const texts = clone.querySelectorAll('.card-text');
            texts[0].textContent = `Capacidade: ${q.capacidade} hóspedes`;
            texts[1].textContent = `${q.preco} €/noite`;
            const dias = Math.ceil((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24));
            const total = dias * q.preco;
            texts[2].textContent = `Total: ${total.toFixed(2)} € (${dias} noites)`;
            const button = clone.querySelector('button');
            button.onclick = () => selecionarQuarto(q.id, checkin, checkout);
            resultados.appendChild(clone);
        });
    }
    resultados.style.display = 'block';
}

function selecionarQuarto(id, checkin, checkout) {
    document.getElementById('quarto').value = id;
    document.getElementById('inicio').value = checkin;
    document.getElementById('fim').value = checkout;
    formReservaContainer.style.display = 'block';
    formReservaContainer.scrollIntoView();
}

document.getElementById('formReserva').addEventListener('submit', e => {
    e.preventDefault();
    const quartoId = +document.getElementById('quarto').value;
    const inicio = document.getElementById('inicio').value;
    const fim = document.getElementById('fim').value;

    const q = quartos.find(q => q.id === quartoId);
    if (!q) {
        alert('Quarto não encontrado!');
        return;
    }

    const startDate = new Date(inicio);
    const endDate = new Date(fim);

    if (startDate >= endDate) {
        alert('Data de início deve ser anterior à data de fim!');
        return;
    }

    if (startDate.getFullYear() !== 2025 || endDate.getFullYear() !== 2025) {
        alert('As reservas devem ser para o ano de 2025!');
        return;
    }

    // Check for overlap
    const overlap = reservas.some(r => r.quartoId === quartoId &&
        ((startDate < new Date(r.fim) && endDate > new Date(r.inicio))));
    if (overlap) {
        alert('Já existe uma reserva para este quarto neste período!');
        return;
    }

    const dias = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const total = dias * q.preco;

    reservas.push({ quartoId, inicio, fim, total: total.toFixed(2) });
    salvarDados();
    atualizar();
    document.getElementById('formReserva').reset();
    formReservaContainer.style.display = 'none';
    alert('Reserva feita com sucesso!');
});

function atualizar() {
    lista.innerHTML = '';
    reservas.forEach((r, i) => {
        const q = quartos.find(qq => qq.id === r.quartoId);
        const tipo = q ? q.tipo : 'Desconhecido';
        lista.innerHTML += `<tr><td>${r.quartoId} - ${tipo}</td><td>${r.inicio}</td><td>${r.fim}</td><td>${r.total} €</td><td><button class="btn btn-danger btn-sm" onclick="removerReserva(${i})">Remover</button></td></tr>`;
    });
}

function removerReserva(index) {
    if (confirm('Tem certeza que deseja remover esta reserva?')) {
        reservas.splice(index, 1);
        salvarDados();
        atualizar();
    }
}

atualizar();
atualizarQuartosSelect();