import Weather from './components/Weather'

export default function App() {
  return (
    <div className="w-screen max-w-[600px] h-svh flex flex-col text-center bg-gradient-to-b from-[#8BC6EC] to-[#9599E2] text-white">
      <Weather />
    </div>
  )
}
