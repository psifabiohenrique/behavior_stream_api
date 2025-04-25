import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <header>
        <h1>Behavior Stream</h1>
        <p>Sistema de Gestão de Atividades para Psicólogos</p>
      </header>
      <main>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            Contador: {count}
          </button>
          <p>
            Edite <code>src/App.tsx</code> e salve para testar a atualização.
          </p>
        </div>
      </main>
    </div>
  )
}

export default App 