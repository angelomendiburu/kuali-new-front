import { useState } from 'react'
import { Button } from './components/ui/button'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <main className="flex justify-center align-center h-[100vh]">
        <Button className="cursor-pointer">Hola Mundo</Button>
      </main>
    </>
  )
}

export default App
