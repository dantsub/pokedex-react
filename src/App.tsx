import './App.css';
import { usePokemon } from './app/hooks/usePokemon';

function App() {
  const { pokemon, loading, error } = usePokemon(1);
  if (loading) {
    return <h1>Loading...</h1>;
  } else if (error) {
    return <h1>Error</h1>;
  } else {
    return (
      <section>
        <h2>
          {pokemon?.getName() || 'Unknown'} <span>{pokemon?.getFormattedId() || '#000'}</span>
        </h2>
        <img
          className="mx-auto"
          src={pokemon?.sprites.frontDefault || 'https://placehold.co/96'}
          alt="Pokemon"
        />
        <p>Height: {pokemon?.getDisplayHeight('es') || 'unknown'}</p>
        <p>Weight: {pokemon?.getDisplayWeight('es') || 'unknown'}</p>
        <ul>
          {pokemon?.types.map(type => (
            <li key={type}>{type}</li>
          ))}
        </ul>
      </section>
    );
  }
}

export default App;
