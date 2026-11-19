import { Link } from 'react-router-dom'

export default function WhatToDoCard({ items }: { items: string[] }) {
  return (
    <>
      <div className="card">
        <ol className="todo-list">
          {items.map((t, i) => <li key={i}>{t}</li>)}
        </ol>
      </div>
      <div className="button-row">
        <Link to="/" className="button primary">Back to all modules</Link>
      </div>
    </>
  )
}
