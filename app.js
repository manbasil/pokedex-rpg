const pokeDex = document.querySelector('.pokedex');
const pokeName = document.querySelector('.poke-name ');
const pokeMove = document.querySelector('#poke-move');
const pokeImage = document.querySelector('#poke-images');
const btnsearch = document.querySelector('#btn-search');
const searchtext = document.querySelector('#search-text');
const cardBox = document.getElementsByClassName('poke-details')[0];
const pokeTypeOne = document.querySelector('.one');
const pokeTypeTwo = document.querySelector('.two');
const leftBox = document.querySelector('#btn-back');
const rightBox = document.querySelector('#btn-next');
let inputPokeName = "";
let moveEffect = "";
pokeName.textContent = "";
let canMove = false;
let left = true;

function createCard(moveName, moveDescription) { //cria dinamicamente as cards
    let move = 0;
    const card = document.createElement('div');
    card.className = "card";

    const cardTop = document.createElement('div');
    cardTop.innerText = moveName;
    cardTop.className = "card-top";

    const cardCenter = document.createElement('div');
    cardCenter.innerText = moveDescription;
    cardCenter.className = "card-center";
    card.append(cardTop);
    card.append(cardCenter);

    return card


}

function createSingleImage(imageFrontSrc) { //cria a imagem de um pokemon só
    let image = `
        <img id="poke-front-image" class = "poke-single-image"
        src="${imageFrontSrc}"></img>   
        `
    pokeImage.innerHTML = image;
}

function createImages(imageFrontSrc, imageBackSrc) { //Cria as imagens dos pokemons
    let image = `
        <img id="poke-front-image"
        src="${imageFrontSrc}"></img>     
        <img id="poke-back-image"
        src="${imageBackSrc}"></img>
        `
    pokeImage.innerHTML = image;
}

function checkMove(moveName) { //cria as cards com os moves

    fetch(`https://pokeapi.co/api/v2/move/${moveName}`)
        .then(res => res.json())
        .then(data => {
            if(data['effect_entries'][0]['effect']){
                cardBox.appendChild(createCard(data['name'], data['effect_entries'][0]['effect']));
            }
        });
}

function checkPokemon(inputPokeName) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${inputPokeName}`) //pega o site de onde vamos tirar a informação
        .then(res => res.json())
        .then(data => {
            pokeTypeOne.textContent = "";
            pokeTypeTwo.textContent = "";
            pokeName.textContent = data['name'];
            const dataMoves = data['moves']; //mostra qual informação iremos pegar
            if (data['id'] < 650) {
                createImages(data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'],
                    data['sprites']['versions']['generation-v']['black-white']['animated']['back_default']);
            } else {
                createSingleImage(data['sprites']['front_default']);
            }
            for (i = 0; i < dataMoves.length-2; i++) { //mostra todos os moves
                if (dataMoves[i]['version_group_details'][(dataMoves[i]['version_group_details']
                        .length) - 1]['move_learn_method']['name'] == "level-up" || dataMoves[i]['version_group_details'][(dataMoves[i]['version_group_details']
                        .length) - 1]['move_learn_method']['name'] == "egg") {
                    checkMove(dataMoves[i]['move']['name']);

                }
            }
            pokeTypeOne.textContent = data['types'][0]['type']['name'];
            if(data['types'][1]){
                pokeTypeTwo.textContent = data['types'][1]['type']['name'];
            }

        });
}
function noPokemon(){    
    createSingleImage("https://i.postimg.cc/ZKDx570k/Sem-T-tulo-1.png");
    pokeName.textContent = "ERROR";
    pokeTypeOne.textContent = "???";
    pokeTypeTwo.textContent = "???";
    pokeName.classList.add('no-pokemon');

}
function checkGif(pokeName) {
    try {
        pokeFrontImage.src = `http://play.pokemonshowdown.com/sprites/xyani/${pokename}`
    } catch (e) {
        console.log(e);
    }
}
function checkPokemonNextOrBack(pokeName){
    if(canMove){
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`) //pega o site de onde vamos tirar a informação
        .then(res => res.json())
        .then(data => {
                if(left){
                    checkPokemon(data['id'] - 1);
                }else{
        
                    checkPokemon(data['id'] + 1);
                }
            
        });
    }
    
}


//pesquisa sobre o pokemon
btnsearch.addEventListener('click', () => {
    cardBox.innerHTML = "";
    if (searchtext.value == "" ) { //verifica se a area de texto está vazia
        searchtext.classList.add('wrong-search-text');
        btnsearch.classList.add('wrong-search-btn');
        setTimeout(() => {
            searchtext.classList.remove('wrong-search-text');
            btnsearch.classList.remove('wrong-search-btn');

        }, 500);
    } else {

        inputPokeName = searchtext.value;
        if (searchtext.value > 898 || searchtext.value < 1) {
            noPokemon();
        } else {
            checkPokemon(inputPokeName);
            canMove = true;
        }
    }
})
leftBox.addEventListener('click', () => {
    if (pokeName.textContent == "" || pokeName.textContent == "bulbasaur"||!canMove) {
        noPokemon();
        cardBox.innerHTML = "";
        canMove= false;
        leftBox.classList.add('cursor-blocked:hover');
        leftBox.classList.remove('cursor-pointer:hover');


    }
    else{
        canMove = true;
        left = true;
        checkPokemonNextOrBack(pokeName.textContent);
        cardBox.innerHTML = "";
    }
})
rightBox.addEventListener('click', () => {
    if (pokeName.textContent == "" || pokeName.textContent == "calyrex" || !canMove) {
        noPokemon();
        cardBox.innerHTML = "";
        canMove= false;
    }
    else{
        canMove = true;
        left = false;
        checkPokemonNextOrBack(pokeName.textContent);
        cardBox.innerHTML = "";
    }
})