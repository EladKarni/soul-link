import { Pokedex } from 'pokeapi-js-wrapper';

const { getPokemonByName } = new Pokedex();

const GetPokemonFromPokeAPI = async (selected) => {
  const getDetailsSortedBySlot = (pokemon) => {
    const { name, types, sprites } = pokemon;
    return { name, sprites, types: types.sort((a, b) => a.slot - b.slot) };
  };

  const pokemons = await Promise.all(selected.map((pokemon) => getPokemonByName(pokemon.name)));
  return pokemons.map(getDetailsSortedBySlot);
};

export default GetPokemonFromPokeAPI;
