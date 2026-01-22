const container = document.getElementById('gestaoLista');
const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

for (let m = 1; m <= 12; m++) {
    const reservasMes = reservas.filter(r => {
        const inicio = new Date(r.inicio);
        return inicio.getFullYear() === 2025 && inicio.getMonth() + 1 === m;
    });
    const totalFaturado = reservasMes.reduce((t, r) => t + parseFloat(r.total), 0).toFixed(2);
    const diasReservados = reservasMes.reduce((t, r) => {
        const inicio = new Date(r.inicio);
        const fim = new Date(r.fim);
        const dias = Math.ceil((fim - inicio) / (1000 * 60 * 60 * 24));
        return t + dias;
    }, 0);
    const totalDiasPossiveis = quartos.length * 30;
    const ocupacao = totalDiasPossiveis > 0 ? Math.min((diasReservados / totalDiasPossiveis) * 100, 100).toFixed(1) : 0;
    container.innerHTML += `
        <div class="col-md-6 col-lg-4 mb-3">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${meses[m-1]}</h5>
                    <p class="card-text">Dias Reservados: ${diasReservados}</p>
                    <p class="card-text">Faturação: ${totalFaturado} €</p>
                    <div class="progress">
                        <div class="progress-bar bg-success" role="progressbar" style="width: ${ocupacao}%" aria-valuenow="${ocupacao}" aria-valuemin="0" aria-valuemax="100">${ocupacao}%</div>
                    </div>
                </div>
            </div>
        </div>`;
}