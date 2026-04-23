import { useState } from 'react';
import './App.css';

function App() {
  const [pergunta, setPergunta] = useState('');
  const [resposta, setResposta] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fazerPergunta = async () => {
    if (!pergunta) return;
    
    setLoading(true);
    setResposta(null);

    try {
      const res = await fetch('http://localhost:3333/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pergunta }),
      });

      const data = await res.json();
      setResposta(data);
    } catch (erro) {
      console.error(erro);
      setResposta({ mensagem: "Erro ao conectar com o servidor. O backend está rodando?" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>🤖 Agente Financeiro V0</h1>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          value={pergunta}
          onChange={(e) => setPergunta(e.target.value)}
          placeholder="Ex: Quais empresas estão no sistema?"
          style={{ flex: 1, padding: '10px', fontSize: '16px' }}
          onKeyDown={(e) => e.key === 'Enter' && fazerPergunta()}
        />
        <button 
          onClick={fazerPergunta} 
          disabled={loading}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
        >
          {loading ? 'Pensando...' : 'Perguntar'}
        </button>
      </div>

      {resposta && (
        <div style={{ background: '#f4f4f9', padding: '20px', borderRadius: '8px', color: '#333' }}>
          <h3>{resposta.mensagem}</h3>
          
          <p><small>Intenção detectada: <strong>{resposta.intent}</strong></small></p>

          {resposta.dados && (
            <pre style={{ background: '#222', color: '#0f0', padding: '15px', borderRadius: '5px', overflowX: 'auto' }}>
              {JSON.stringify(resposta.dados, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

export default App;