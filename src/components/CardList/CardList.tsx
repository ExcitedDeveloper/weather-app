import React, { useState } from 'react'
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
    <div className="flex flex-col min-w-full mx-auto p-20">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-col w-100 rounded-md shadow-md mb-4"
        >
          <div
            className="p-4 cursor-pointer"
            onClick={() => handleCardClick(item.id)}
          >
            <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>
          {expandedId === item.id && (
            <div className="p-4 bg-gray-100">
              <p className="text-gray-800">{item.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default CardList
