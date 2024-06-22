import Shape from "./components/Shape"

const BOX_DATA = [
  [1,1,1],
  [1,0,0],
  [1,1,1]
]


function App() {
  

  return (
    <>
      <Shape data={BOX_DATA} />
    </>
  )
}

export default App
