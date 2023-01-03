import { useState } from 'react'
// import 'tailwindcss/dist/base.css'
// import 'tailwindcss/dist/components.css'

interface Card {
  id: number
  title: string
  description: string
  content: string
}

interface Props {
  items: Card[]
}

const CardList: React.FC<Props> = ({ items }) => {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const handleCardClick = (id: number) => {
    setExpandedId((prevId) => (prevId === id ? null : id))
  }

  return (
    <div className="mx-auto flex min-w-full flex-col p-20">
      {items.map((item) => (
        <div
          key={item.id}
          className="w-100 mb-4 flex flex-col rounded-md shadow-md"
        >
          <div
            role="button"
            tabIndex={0}
            className="cursor-pointer p-4"
            onClick={() => handleCardClick(item.id)}
            onKeyDown={() => handleCardClick(item.id)}
          >
            <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>
          {expandedId === item.id && (
            <div className="bg-gray-100 p-4">
              <p className="text-gray-800">{item.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default CardList
