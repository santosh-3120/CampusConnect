//THIS IS DINNU
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// YaswanthD

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex justify-center space-x-4 py-4">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className="text-center text-4xl font-bold mb-4">Vite + React</h1>
      <div className="card text-center p-6 border border-gray-200 rounded-lg shadow-lg">
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          count is {count}
        </button>
        <p className="mt-4 text-sm">
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="text-center mt-4 text-gray-500">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
