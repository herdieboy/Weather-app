import Weather from './components/Weather'

export default function App() {
  return (
    <div className="w-screen h-svh md:h-auto flex flex-col text-center bg-gradient-to-b from-[#171933] to-[#00081a] text-white">
      <Weather />
    </div>
  )
}
