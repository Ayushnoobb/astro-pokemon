import React, { useState } from "react";
import { fetchPokemonByName, fetchPokemon } from "../lib/FetchData";
import { useQuery } from "@tanstack/react-query";
import { client } from "../lib/store";

interface Pokemon {
  name: string;
}

interface SearchbarProps {
  onSearchTermChange: (searchTerm: string, isOptionClick: boolean) => void;
}

const Searchbar: React.FC<SearchbarProps> = ({ onSearchTermChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);

  const { status, data } = useQuery<Pokemon[]>(
    {
      queryKey: ["all_poke"],
      queryFn: fetchPokemon,
    },
    client
  );

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
  }

  function handleClick() {
    onSearchTermChange(searchTerm, false);
  }

  function handleOptionClick(selectedName: string) {
    setSearchTerm(selectedName);
    setSelectedPokemon(selectedName);
    onSearchTermChange(selectedName, true);
  }

  const filteredPokemon = data?.filter((poke) =>
    poke.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="pokemon-list__filter">
        <input
          type="text"
          name="filter"
          id="filter"
          placeholder="Search"
          className="pokemon-list__filter-text"
          value={searchTerm}
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
      <ul className="pokemon-list__filter-search__result-option">
        {filteredPokemon?.map((poke) => (
          <li
            className={`pokem ${
              poke.name === selectedPokemon ? "selected" : ""
            }`}
            key={poke.name}
            onClick={() => handleOptionClick(poke.name)}
          >
            {poke.name}
          </li>
        ))}
      </ul>
    </>
  );
};

export default Searchbar;
