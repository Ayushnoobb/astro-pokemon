export async function fetchPokemon(){
  const jsonPokemon = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0");
  const allPokemon = await jsonPokemon.json();

  return allPokemon.results;
}

export async function fetchPage(offset: number) {
  const jsonPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
  const allPokemon = await jsonPokemon.json();

  // Fetch individual details for each Pokemon
  const pokemonDetailsPromises = allPokemon.results.map(async (pokemon:any) => {
    const pokemonDetailResponse = await fetch(pokemon.url);
    const pokemonDetail = await pokemonDetailResponse.json();
    return {
      name: pokemonDetail.name,
      url: pokemonDetail.sprites.front_default,
      types:pokemonDetail.types
    };
  });

  const pokemonDetails = await Promise.all(pokemonDetailsPromises);

  return pokemonDetails;
}
