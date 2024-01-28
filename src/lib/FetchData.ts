export async function fetchPokemon(){
  const jsonPokemon = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0");
  const allPokemon = await jsonPokemon.json();

  return allPokemon.results;
}

export async function fetchPage(pageParam:number) {
  console.log(pageParam);
  const offset = (pageParam)*20 < 0 ? 0 :(pageParam)*20 ;
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

export const fetchPokemonByName = async (name: string) => {
  console.log("by nmae")
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error('Failed to fetch Pokemon details');
  }
  return {
    name:name,
    url:data.sprites.front_default,
    types:data.types
  };
};
