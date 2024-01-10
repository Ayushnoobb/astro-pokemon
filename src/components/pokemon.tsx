import React, { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPage } from '../lib/FetchData';
import { client } from '../lib/store';
import { useInView } from 'react-intersection-observer'

interface Pokemon {
  name: string;
  url: string;
}

function Pokemon() {
  const { ref, inView } = useInView({threshold:1})
  const [searchText, setSearchText] = useState<string>('');
  const listRef = useRef<HTMLUListElement | null>(null);

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
    queryFn: ({ pageParam }) => fetchPage(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.current_page === lastPage.last_page ? undefined : lastPage.current_page + 1,
  }, client);


  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(e.target.value);
  }

  function handleClick() {
    // Perform any actions based on searchText
  }

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      console.log("debug");
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      <section className="pokemon-list">
        <div className="pokemon-list__wrapper">
          <div className="container">
            <div className="container--inner">
              <div className="pokemon-list__row">
                <div className="pokemon-list__column">
                  <h2 className="pokemon-list__filter-head">Name or Number</h2>
                  <div className="pokemon-list__filter">
                    <input
                      type="text"
                      name="filter"
                      id="filter"
                      placeholder="search"
                      className="pokemon-list__filter-text"
                      onChange={handleChange}
                    />
                    <button
                      className="pokemon-list__filter-search"
                      onClick={handleClick}
                      type="button"
                    >
                      Search
                    </button>
                  </div>
                </div>
                <div className="pokemon-list__column">
                  <div className="pokemon-list__filter-disclaimer">
                    Search for Pokemon using name or using its National Pokedex Number
                  </div>
                </div>
              </div>
            </div>
            <div className="pokemon-list__list-wrapper">
              <div className="container--inner">
                <ul className="pokemon-list__list">
                  <>
                    {data?.pages[0].map(({ name, url ,types}, id) => (
                      <li key={id} className="pokemon-list__list-individual">
                        <h3 className="pokemon-list__name">{name.toUpperCase()}</h3>
                        <img src={url} alt={name} />
                        <div className="pokemon-list__types">
                          {
                            types.map((type:any , id:number) => {
                              return(
                                <p className='pokemon-list__type'>{type.type.name}</p>
                              )
                            })
                          }
                        </div>
                      </li>
                    ))}
                  </>
                </ul>
                {isFetching && <p>Loading...</p>}
                <button ref={ref} onClick={() => {hasNextPage && !isFetchingNextPage && fetchNextPage();console.log("clicked")}}>Button load more</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Pokemon;
