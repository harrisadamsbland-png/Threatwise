export default function LessonStep({ lesson, financeExample }: { lesson: string[]; financeExample: string }) {
  return (
    <>
      {lesson.map((p, i) => <p key={i}>{p}</p>)}
      <div className="callout finance">
        <h3>In finance and crypto</h3>
        <p>{financeExample}</p>
      </div>
    </>
  )
}
