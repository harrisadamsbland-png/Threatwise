import type { Story } from '../content/types'

export default function StoryStep({ story }: { story: Story }) {
  return (
    <>
      <p className="muted">{story.date}</p>
      {story.body.map((p, i) => <p key={i}>{p}</p>)}
      <div className="callout">
        <h3>The moment it could have been stopped</h3>
        <p>{story.stopMoment}</p>
      </div>
      <div className="sources">
        <strong>Sources</strong>
        <ul>
          {story.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer">{s.title}</a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
