import Weather from './components/Weather'

export default function App() {
  return (
    <div className="w-screen flex flex-col items-center text-center bg-gradient-to-b from-[#8BC6EC] to-[#9599E2] text-white">
      <div className="max-w-[600px] min-h-svh p-[1rem]">
        <Weather />
      </div>
    </div>
  )
}
