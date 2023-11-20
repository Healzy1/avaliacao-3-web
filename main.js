// SPA
const conteudo = document.querySelector('#conteudo');
function menu(link){

    fetch('pages/' + link  + '.html')
    .then(response => response.text())
    .then(html => conteudo.innerHTML = html)
    .catch(error => conteudo.innerHTML = 'Página não encontrada');
}

// imagens alternando na home

var imagens = ["images/steins gate img.jpg", "images/one piece img.png", "images/bleach img.jpg"]; // lista das imagens
var indiceImagem = 0;

function alterarImagem() {
    var imgElement = document.querySelector('.anime-imagens-mudando'); // peguei a imagem pela classe
    imgElement.src = imagens[indiceImagem]; // alterar a imagem
    indiceImagem = (indiceImagem + 1) % imagens.length; // atualizar o índice da imagem
}

setInterval(alterarImagem, 3000); // ficar alterando a imagem a cada 3 segundos

//crud
const tbody = document.querySelector('#dados');
const url = 'https://crud-web-p3-default-rtdb.firebaseio.com/'
const nome = document.querySelector('#nome');
const anime = document.querySelector('#anime');
const fato = document.querySelector('#fato');
const id = document.querySelector('#id');

var clientes = [];

const render = () => {

    tbody.innerHTML = '';
    clientes.sort().forEach(usuario => {
        const tr = document.createElement('tr');
        const tdId = document.createElement('td');
        const tdNome = document.createElement('td');
        const tdAnime = document.createElement('td');
        const tdFato = document.createElement('td');
        const tdAcoes = document.createElement('td');

        tdId.innerHTML = usuario.id;
        tdNome.innerHTML = usuario.nome;
        tdAnime.innerHTML = usuario.anime;
        tdFato.innerHTML = usuario.fato;
        const iconeEditar = document.createElement('i');
        const iconeRemover = document.createElement('i');

        iconeEditar.className = 'mdi mdi-pencil';
        iconeRemover.className = 'mdi mdi-delete';

        iconeEditar.addEventListener('click', () => loadEdit(usuario.id));
        iconeRemover.addEventListener('click', () => Delete(usuario.id));

        tdAcoes.appendChild(iconeEditar);
        tdAcoes.appendChild(iconeRemover);

        tr.appendChild(tdId);
        tr.appendChild(tdNome);
        tr.appendChild(tdAnime);
        tr.appendChild(tdFato);
        tr.appendChild(tdAcoes);

        tbody.appendChild(tr);
    });
}
render();

function loadEdit(key) {
    const clienteEdit = clientes.find(cliente => cliente.id === key);
    nome.value = clienteEdit.nome;
    anime.value = clienteEdit.anime;
    fato.value = clienteEdit.fato;
    id.value = clienteEdit.id;
}

function Save() {
    (id.value == '') ? Create() : Update(); // if else pra ver se o id já tá lá 
}

/* funçoes crud com o base de fogo 🔥 */

// CREATE
function Create() {
    // cria o objeto cliente com os dados do form
    const cliente = {
        nome: nome.value,
        anime: anime.value,
        fato: fato.value
    }

    // enviar o objeto para o firebase
    fetch(url + '/clientes.json', {
        method: 'POST', 
        body: JSON.stringify(cliente) // objeto cliente convertido para json
    }) // URL da API do Firebase
        .then(response => response.json()) // qual formato será usado para receber a resposta do servidor
        .then(() => {
            nome.value = ''
            anime.value = ''
            fato.value = ''
            Read(); //ler os campos pra atualizar a tabelinha
        }) // o que fazer com a resposta do servidor se for sucesso
        .catch(error => console.log(error)); // o que fazer com a resposta do servidor se der erro
}

// read

function Read() {
    fetch(url + '/clientes.json', {
        method: 'GET'
    })
        .then(response => response.json())
        .then(response => {
            clientes = [];
            for (const id in response) {
                response[id].id = id
                clientes.push(response[id])
            }
            render();
        })
        .catch();
}

// update

function Update() {
    const cliente = {
        nome: nome.value,
        anime: anime.value,
        fato: fato.value
    }
    fetch(url + '/clientes/' + id.value + '.json', {
        method: 'PUT',
        body: JSON.stringify(cliente)
    })
    .then(() => {
        nome.value = ''
        anime.value = ''
        fato.value = ''
        id.value = ''
        Read(); //ler os campos pra atualizar a tabelinha e não dar conflito entre criar e atualizar
    }) // o que fazer com a resposta do servidor se for sucesso
        .catch(error => console.log(error));
}

// delete

function Delete(id) {
    fetch(url + '/clientes/' + id + '.json', {
        method: 'DELETE'
    })
        .then(() => Read())
        .catch(error => console.log(error));
}
