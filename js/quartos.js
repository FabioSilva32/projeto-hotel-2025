const tbody = document.getElementById('listaQuartos');
let editingId = null;

document.getElementById('formQuarto').addEventListener('submit', e => {
    e.preventDefault();
    const tipo = document.getElementById('tipo').value.trim();
    const capacidade = +document.getElementById('capacidade').value;
    const preco = +document.getElementById('preco').value;
    const imagem = document.getElementById('imagem').value.trim();
    if (!tipo || capacidade <= 0 || preco <= 0) return;

    if (editingId !== null) {
        // Update existing
        const index = quartos.findIndex(q => q.id === editingId);
        if (index !== -1) {
            quartos[index] = { id: editingId, tipo, capacidade, preco, imagem };
        }
        editingId = null;
        document.querySelector('#formQuarto button').textContent = 'Adicionar Quarto';
    } else {
        // Add new
        const id = quartos.length ? Math.max(...quartos.map(q => q.id)) + 1 : 1;
        quartos.push({ id, tipo, capacidade, preco, imagem });
    }
    salvarDados();
    atualizarQuartos();
    document.getElementById('formQuarto').reset();
});

function atualizarQuartos() {
    tbody.innerHTML = '';
    quartos.forEach(q => {
        const template = document.getElementById('quartoTemplate');
        const clone = template.content.cloneNode(true);
        const img = clone.querySelector('img');
        img.src = q.imagem;
        img.alt = q.tipo;
        const tds = clone.querySelectorAll('td');
        tds[1].textContent = q.id;
        tds[2].textContent = q.tipo;
        tds[3].textContent = q.capacidade;
        tds[4].textContent = q.preco;
        const buttons = clone.querySelectorAll('button');
        buttons[0].onclick = () => editarQuarto(q.id); // Edit button
        buttons[1].onclick = () => removerQuarto(q.id); // Remove button
        tbody.appendChild(clone);
    });
}

function editarQuarto(id) {
    const quarto = quartos.find(q => q.id === id);
    if (quarto) {
        document.getElementById('tipo').value = quarto.tipo;
        document.getElementById('capacidade').value = quarto.capacidade;
        document.getElementById('preco').value = quarto.preco;
        document.getElementById('imagem').value = quarto.imagem;
        editingId = id;
        document.querySelector('#formQuarto button').textContent = 'Atualizar Quarto';
    }
}

function removerQuarto(id) {
    if (confirm('Tem certeza que deseja remover este quarto?')) {
        quartos = quartos.filter(q => q.id !== id);
        salvarDados();
        atualizarQuartos();
    }
}

atualizarQuartos();