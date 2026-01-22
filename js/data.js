const quartosDefault = [
{ id: 1, tipo: 'Single', preco: 50, capacidade: 1, imagem: 'images/single.jpg' },
{ id: 2, tipo: 'Double', preco: 80, capacidade: 2, imagem: 'images/double.jpg' },
{ id: 3, tipo: 'Suite', preco: 120, capacidade: 4, imagem: 'images/suite.jpg' }
];

let quartos = JSON.parse(localStorage.getItem('quartos')) || quartosDefault;
let reservas = JSON.parse(localStorage.getItem('reservas')) || [];

function salvarDados() {
    localStorage.setItem('quartos', JSON.stringify(quartos));
    localStorage.setItem('reservas', JSON.stringify(reservas));
}