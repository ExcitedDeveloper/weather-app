import './App.css'
import UilReact from '@iconscout/react-unicons/icons/uil-react'
import Search from './components/Search/Search'
import CardList from './components/CardList/CardList'

const testData = [
  {
    id: 1,
    title: 'Card 1',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dictum ultricies mauris, ut tincidunt leo vehicula id. Praesent ultricies arcu in felis interdum, sed porttitor ligula pellentesque. Sed dapibus, diam in dignissim tincidunt, metus purus fermentum metus, a mollis nisi nisi in enim.',
  },
  {
    id: 2,
    title: 'Card 2',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dictum ultricies mauris, ut tincidunt leo vehicula id. Praesent ultricies arcu in felis interdum, sed porttitor ligula pellentesque. Sed dapibus, diam in dignissim tincidunt, metus purus fermentum metus, a mollis nisi nisi in enim.',
  },
  {
    id: 3,
    title: 'Card 3',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore officiis esse odit ab distinctio quibusdam facere aperiam rem quae porro?',
  },
]

function App() {
  const handleOnSearchChange = (searchData: unknown) => {
    console.log(`************ searchData`, searchData)
  }

  return (
    <div className="flex flex-col">
      <div className="mx-auto mt-5 py-5 w-1/4">
        <Search onSearchChange={handleOnSearchChange} />
      </div>
      <CardList items={testData} />
    </div>
  )
}

export default App
