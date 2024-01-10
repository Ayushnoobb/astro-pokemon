export function FilterData(){
  const data = fetch("https://pokeapi.co/api/v2/pokemon").then(
    res => res.json()
  )
  return data;
}