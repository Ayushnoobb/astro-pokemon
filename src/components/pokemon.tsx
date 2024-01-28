import React, { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPage, fetchPokemonByName } from '../lib/FetchData';
import { client } from '../lib/store';
import Searchbar from './searchbar';

interface Pokemon {
  name: string;
  url: string;
  types: { type: { name: string } }[];
}

// ... (imports)

function Pokemon() {
  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['pokemoon'],
    queryFn: ({ pageParam = 0 }) => fetchPage(pageParam),
    initialPageParam: 0,
    getNextPageParam: (_lastPage, pages) => {
      return pages.length < 1320 ? pages.length : undefined;
    },
  }, client);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchedPokemon, setSearchedPokemon] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchTermChange = async (newSearchTerm: string, isOptionClick: boolean = true) => {
    setSearchTerm(newSearchTerm);

    if (isOptionClick) {
      try {
        setIsLoading(true);
        const pokemonDetails: Pokemon = await fetchPokemonByName(newSearchTerm);
        setSearchedPokemon(pokemonDetails);
        console.log('Fetched Pokemon Details:', pokemonDetails);
      } catch (error) {
        console.error('Error fetching Pokemon details:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const filteredPokemon =
    data?.pages.reduce((acc, page) => acc.concat(page), []).filter((poke) =>
      poke.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <>
      <section className="pokemon-list">
      <div className="pokemon-list__wrapper">
          <div className="container">
            <div className="container--inner">
              <div className="pokemon-list__row">
                <div className="pokemon-list__column">
                  <h2 className="pokemon-list__filter-head">Name</h2>
                  <Searchbar onSearchTermChange={handleSearchTermChange} />
                </div>
                <div className="pokemon-list__column">
                  <div className="pokemon-list__filter-disclaimer">
                    Search for Pokemon using name
                  </div>
                <button onClick={()=>{setSearchTerm('')}} className="pokemon-list__filter-search">Reset</button>
                </div>
              </div>
            </div>
            <div className="pokemon-list__list-wrapper">
              <div className="container--inner">
                <ul className="pokemon-list__list">
                  {filteredPokemon?.map(({ name, url, types }, id) => (
                    <li key={id} className="pokemon-list__list-individual">
                      <h3 className="pokemon-list__name">{name.toUpperCase()}</h3>
                      <img src={url} alt={name} />
                      <div className="pokemon-list__types">
                        {types.map((type: any, id: number) => (
                          <p key={id} className={`pokemon-list__type ${type.type.name}`}>
                            {type.type.name}
                          </p>
                        ))}
                      </div>
                    </li>
                  ))}
                  {filteredPokemon?.length === 0 && searchedPokemon && (
                    <li className="pokemon-list__list-individual">
                      <h3 className="pokemon-list__name">{searchedPokemon.name.toUpperCase()}</h3>
                      <img src={searchedPokemon.url} alt={searchedPokemon.name} />
                      <div className="pokemon-list__types">
                        {searchedPokemon.types.map((type: any, id: number) => (
                          <p key={id} className={`pokemon-list__type ${type.type.name}`}>
                            {type.type.name}
                          </p>
                        ))}
                      </div>
                    </li>
                  )}
                </ul>
                {isFetching && hasNextPage && <span className="loader"></span>}
                {isLoading&& <span className="loader"></span>}
                <button
                  onClick={() => {
                      fetchNextPage();
                  }}
                  className='pokemon-list__filter-search load-more-btn'
                >
                  Button load more
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Pokemon;


