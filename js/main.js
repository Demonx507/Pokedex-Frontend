const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn");
const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#search-btn")

let URL = "https://pokeapi.co/api/v2/pokemon/";
let todosLosPokemons = [];

async function cargarPokemons() {
    for (let i = 1; i <= 151; i++){
        try{
            const response = await fetch(URL + i);
            const data = await response.json();
            todosLosPokemons.push(data);
            
            mostrarPokemon(data);

        } catch (error) {
            console.error("Error cargando el Pokémon " + i, error);
        }
        
    } 
    mostrarListaPokemons(todosLosPokemons)
}

function buscarPokemon(){
    const texto = searchInput.value.toLowerCase().trim();

    if (texto == ""){
        mostrarListaPokemons(todosLosPokemons);
        return;
    }

    const resultado = todosLosPokemons.filter(poke =>
        poke.name.toLowerCase().includes(texto) ||
        poke.id.toString() === texto
    );
    mostrarListaPokemons(resultado);
}

searchBtn.addEventListener("click", buscarPokemon);

searchInput.addEventListener("keyup", (Event) => {
    if (Event.key === "Enter"){
        buscarPokemon();
    }
})


function mostrarListaPokemons(lista) {
    listaPokemon.innerHTML = "";
    lista.forEach(poke => mostrarPokemon(poke));
}

function mostrarPokemon(poke) {

    let tipos = poke.types.map((type) => `<p class="${type.type.name}">${type.type.name}</p>`).join('');

    let pokeId = poke.id.toString().padStart(3, "0");

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <p class="pokemon-id-back">#${pokeId}</p>
        <div class="pokemon-imagen">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">    
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos}
            </div>
            <div class="pokemon-stats">
                    <p class="stat">${poke.height}m</p>
                    <p class="stat">${poke.weight}kg</p>
            </div>
        </div>
    `;
    listaPokemon.append(div);
}

botonesHeader.forEach(boton => boton.addEventListener("click", (event) =>{
    const botonId = event.currentTarget.id; 

    if(botonId === "ver-todos"){
        mostrarListaPokemons(todosLosPokemons);
    } else {
        const filtrados = todosLosPokemons.filter(poke =>
            poke.types.some(type => type.type.name === botonId)
        );
        mostrarListaPokemons(filtrados);
    }

}));

cargarPokemons();