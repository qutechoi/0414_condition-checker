import { useMemo, useState } from 'react'
import './App.css'

const metrics = [
  {
    key: 'sleep',
    label: '수면',
    hint: '어제 잠을 얼마나 잘 잤는지',
    emoji: '😴',
  },
  {
    key: 'energy',
    label: '에너지',
    hint: '지금 몸에 힘이 얼마나 있는지',
    emoji: '⚡️',
  },
  {
    key: 'mood',
    label: '기분',
    hint: '오늘 기분이 어떤지',
    emoji: '🙂',
  },
  {
    key: 'focus',
    label: '집중력',
    hint: '집중이 잘 되는 상태인지',
    emoji: '🧠',
  },
  {
    key: 'stress',
    label: '스트레스',
    hint: '높을수록 더 지친 상태야',
    emoji: '🫠',
    reverse: true,
  },
]

const quickActions = [
  {
    title: '오늘 추천 모드',
    getText: (score) => {
      if (score >= 85) return '집중 작업, 중요한 결정, 어려운 일 처리하기 좋은 날이야.'
      if (score >= 65) return '핵심 업무 1~2개를 잡고 밀기 좋은 상태야.'
      if (score >= 45) return '가벼운 업무, 정리, 짧은 할 일 위주가 좋아.'
      return '회복 모드. 오늘은 무리하지 않는 게 이득이야.'
    },
  },
  {
    title: '추천 리셋',
    getText: (score) => {
      if (score >= 85) return '좋은 흐름이니 짧은 휴식만 챙기면서 달리면 돼.'
      if (score >= 65) return '물 한 잔, 짧은 산책, 그리고 제일 중요한 일부터 시작해.'
      if (score >= 45) return '카페인, 자리 정리, 할 일 축소가 꽤 도움 된다.'
      return '수분, 음식, 햇빛, 휴식. 오늘은 죄책감 없이 회복 우선.'
    },
  },
]

function getConditionLabel(score) {
  if (score >= 85) return { label: '최상 컨디션', color: 'peak' }
  if (score >= 65) return { label: '꽤 괜찮음', color: 'good' }
  if (score >= 45) return { label: '그럭저럭', color: 'mid' }
  return { label: '회복 필요', color: 'low' }
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
          <h1>오늘의 컨디션 체크기</h1>
          <p>
            수면, 에너지, 기분, 집중력, 스트레스를 빠르게 체크해서
            오늘 내 상태를 점수로 보고, 어떤 하루를 보내면 좋을지 가볍게 판단하는 웹앱이야.
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
          <h2>상태 체크</h2>
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
          <h2>오늘의 해석</h2>
          <div className="insight-grid">
            {quickActions.map((item) => (
              <article key={item.title} className="insight-card">
                <h3>{item.title}</h3>
                <p>{item.getText(score)}</p>
              </article>
            ))}
          </div>

          <article className="summary-card">
            <h3>한줄 분석</h3>
            <p>
              {score >= 85 && '오늘은 꽤 좋은 날이야. 중요한 일 먼저 처리하면 효율이 잘 나올 가능성이 높아.'}
              {score >= 65 && score < 85 && '무난하게 괜찮은 컨디션이야. 욕심만 조금 줄이면 안정적으로 잘 굴러갈 수 있어.'}
              {score >= 45 && score < 65 && '기능은 하지만 최상은 아니야. 작은 단위로 끊어서 하는 게 훨씬 좋아.'}
              {score < 45 && '몸이나 머리가 쉬고 싶어 하는 상태야. 오늘은 회복 중심으로 가는 게 맞아.'}
            </p>
          </article>
        </section>
      </section>
    </main>
  )
}

export default App
