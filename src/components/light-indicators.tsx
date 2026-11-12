export function LightIndicators() {
  return (
    <div className="relative flex items-start gap-2">
      <div className="pokedex-light pokedex-light--main"></div>
      <div className="pokedex-led pokedex-led--red"></div>
      <div className="pokedex-led pokedex-led--yellow"></div>
      <div className="pokedex-led pokedex-led--green"></div>
    </div>
  );
}
