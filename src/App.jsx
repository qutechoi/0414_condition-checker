import { useMemo, useState } from 'react'
import './App.css'

const metrics = [
  {
    key: 'sleep',
    label: 'Sleep',
    hint: 'How well did you sleep?',
    emoji: '😴',
  },
  {
    key: 'energy',
    label: 'Energy',
    hint: 'How much energy do you have right now?',
    emoji: '⚡️',
  },
  {
    key: 'mood',
    label: 'Mood',
    hint: 'How is your mood today?',
    emoji: '🙂',
  },
  {
    key: 'focus',
    label: 'Focus',
    hint: 'Can you concentrate well today?',
    emoji: '🧠',
  },
  {
    key: 'stress',
    label: 'Stress',
    hint: 'Higher means more stressed.',
    emoji: '🫠',
    reverse: true,
  },
]

const quickActions = [
  {
    title: 'Best for today',
    getText: (score) => {
      if (score >= 85) return 'Deep work, hard tasks, and important decisions.'
      if (score >= 65) return 'Focused work with one or two important priorities.'
      if (score >= 45) return 'Light admin, easy wins, and shorter task blocks.'
      return 'Recovery mode. Keep it small and kind.'
    },
  },
  {
    title: 'Suggested reset',
    getText: (score) => {
      if (score >= 85) return 'Ride the momentum, but still take short breaks.'
      if (score >= 65) return 'Water, a short walk, then start with the hardest task.'
      if (score >= 45) return 'Coffee or tea, tidy your desk, and lower your expectations.'
      return 'Rest, hydration, food, sunlight, and no guilt.'
    },
  },
]

function getConditionLabel(score) {
  if (score >= 85) return { label: 'Peak mode', color: 'peak' }
  if (score >= 65) return { label: 'Pretty good', color: 'good' }
  if (score >= 45) return { label: 'So-so', color: 'mid' }
  return { label: 'Need recovery', color: 'low' }
}

function App() {
  const [values, setValues] = useState({
    sleep: 7,
    energy: 6,
    mood: 6,
    focus: 6,
    stress: 4,
  })

  const score = useMemo(() => {
    const total = metrics.reduce((sum, metric) => {
      const raw = values[metric.key]
      const normalized = metric.reverse ? 11 - raw : raw
      return sum + normalized
    }, 0)
    return Math.round((total / (metrics.length * 10)) * 100)
  }, [values])

  const condition = getConditionLabel(score)

  return (
    <main className="page-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <span className="eyebrow">0414 Daily Tool</span>
          <h1>Today’s Condition Checker</h1>
          <p>
            A tiny self-check page for sleep, energy, mood, focus, and stress.
            Move the sliders, get a quick score, and decide what kind of day you should have.
          </p>
        </div>

        <div className="score-card">
          <div className={`score-orb ${condition.color}`}>
            <strong>{score}</strong>
            <span>/ 100</span>
          </div>
          <div className={`condition-chip ${condition.color}`}>{condition.label}</div>
        </div>
      </section>

      <section className="app-grid">
        <section className="panel form-panel">
          <h2>Check your state</h2>
          <div className="metric-list">
            {metrics.map((metric) => (
              <label key={metric.key} className="metric-row">
                <div className="metric-head">
                  <div>
                    <strong>
                      <span className="emoji">{metric.emoji}</span> {metric.label}
                    </strong>
                    <p>{metric.hint}</p>
                  </div>
                  <span className="metric-value">{values[metric.key]}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={values[metric.key]}
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      [metric.key]: Number(event.target.value),
                    }))
                  }
                />
              </label>
            ))}
          </div>
        </section>

        <section className="panel result-panel">
          <h2>Your readout</h2>
          <div className="insight-grid">
            {quickActions.map((item) => (
              <article key={item.title} className="insight-card">
                <h3>{item.title}</h3>
                <p>{item.getText(score)}</p>
              </article>
            ))}
          </div>

          <article className="summary-card">
            <h3>Simple interpretation</h3>
            <p>
              {score >= 85 && 'You are in unusually strong shape today. Use it well, before your brain notices.'}
              {score >= 65 && score < 85 && 'This is a good working condition. You can push a bit, but keep the structure clean.'}
              {score >= 45 && score < 65 && 'You are functional, but not at your best. Short tasks and momentum will help more than ambition.'}
              {score < 45 && 'Your body or brain is asking for recovery. Today is for maintenance, not heroics.'}
            </p>
          </article>
        </section>
      </section>
    </main>
  )
}

export default App
