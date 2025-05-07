import { Footer } from '@components/Footer/footer.component'
import { Header } from '@components/Header/header.component'
// import { Tabs } from '@ui/Tabs/tabs.component'
import './styles/app.css'
import { TechWork } from '@ui/TechWork/techWork.component'

function App() {
  return (
    <div className='wrapper'>
      <Header />
      <div className='content'>
        {/* <Tabs /> */}
        <TechWork />
      </div>
      <Footer />
    </div>
  )
}

export default App
