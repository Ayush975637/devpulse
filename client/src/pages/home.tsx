// client/src/pages/Home.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim()) navigate(`/${input.trim()}`);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20vh' }}>
      <h1>DevPulse</h1>
      <p>GitHub analytics for developers</p>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter GitHub username"
          style={{ padding: '10px', fontSize: '16px', width: '300px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>
          Search
        </button>
      </form>
    </div>
  );
}





