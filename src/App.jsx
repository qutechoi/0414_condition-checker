import { useMemo, useState } from 'react'
import './App.css'

const metrics = [
  {
    key: 'sleep',
    label: '수면',
    shortLabel: 'Sleep',
    hint: '어젯밤, 몸이 얼마나 깊게 쉬었는지 떠올려봐.',
    question: '어제 잠은 어땠어?',
    emoji: '🌙',
    gradient: 'metric-sleep',
    accent: '#8b5cf6',
    deco: '별빛이 잔잔하게 남아 있는 밤의 결',
    options: ['거의 못 잤어', '깊고 편하게 잤어'],
    tags: ['회복', '숙면', '리듬'],
  },
  {
    key: 'energy',
    label: '에너지',
    shortLabel: 'Energy',
    hint: '지금 몸 안에 남아 있는 추진력을 체크해봐.',
    question: '지금 몸에 힘이 얼마나 남아 있어?',
    emoji: '⚡',
    gradient: 'metric-energy',
    accent: '#06b6d4',
    deco: '스파크가 번지는 전류의 결',
    options: ['축 처져 있어', '꽤 생생해'],
    tags: ['추진력', '활력', '페이스'],
  },
  {
    key: 'mood',
    label: '기분',
    shortLabel: 'Mood',
    hint: '오늘 마음의 온도가 어느 쪽에 가까운지 골라줘.',
    question: '오늘 기분은 어떤 쪽에 가까워?',
    emoji: '🌤️',
    gradient: 'metric-mood',
    accent: '#f59e0b',
    deco: '아침빛이 부드럽게 번지는 색감',
    options: ['가라앉아 있어', '맑고 가벼워'],
    tags: ['감정', '분위기', '톤'],
  },
  {
    key: 'focus',
    label: '집중력',
    shortLabel: 'Focus',
    hint: '생각이 한 점으로 모이는 정도를 느껴봐.',
    question: '집중은 얼마나 잘 잡히는 상태야?',
    emoji: '🎯',
    gradient: 'metric-focus',
    accent: '#22c55e',
    deco: '초점이 또렷해지는 유리 표면',
    options: ['계속 흐트러져', '꽤 또렷해'],
    tags: ['몰입', '선명함', '정리'],
  },
  {
    key: 'stress',
    label: '스트레스',
    shortLabel: 'Stress',
    hint: '몸과 마음을 누르는 압박의 강도를 떠올려봐.',
    question: '지금 스트레스는 어느 정도야?',
    emoji: '🌊',
    gradient: 'metric-stress',
    accent: '#fb7185',
    deco: '파도가 부딪히는 장력의 패턴',
    options: ['평온한 편이야', '많이 눌리고 있어'],
    tags: ['압박', '긴장', '과부하'],
    reverse: true,
  },
]

const defaultValues = {
  sleep: 7,
  energy: 6,
  mood: 6,
  focus: 6,
  stress: 4,
}

function getCondition(score) {
  if (score >= 85) return { label: '오늘 꽤 좋음', tone: 'peak' }
  if (score >= 70) return { label: '안정적으로 괜찮음', tone: 'good' }
  if (score >= 55) return { label: '무난하지만 관리 필요', tone: 'mid' }
  return { label: '회복 우선 모드', tone: 'low' }
}

function getInterpretation(score, values) {
  const strongest = [...metrics]
    .map((metric) => ({
      ...metric,
      value: metric.reverse ? 11 - values[metric.key] : values[metric.key],
      raw: values[metric.key],
    }))
    .sort((a, b) => b.value - a.value)[0]

  const weakest = [...metrics]
    .map((metric) => ({
      ...metric,
      value: metric.reverse ? 11 - values[metric.key] : values[metric.key],
      raw: values[metric.key],
    }))
    .sort((a, b) => a.value - b.value)[0]

  if (score >= 85) {
    return {
      title: '좋은 흐름이 잡힌 날',
      summary: '전체 밸런스가 좋다. 중요한 결정이나 집중 작업을 앞으로 당겨도 괜찮아 보여.',
      action: '가장 중요한 일 1개를 먼저 끝내고, 중간중간 짧은 휴식으로 흐름만 유지해.',
      caution: '페이스가 좋다고 일정을 과하게 넣으면 후반에 갑자기 꺼질 수 있어.',
      strongest,
      weakest,
    }
  }

  if (score >= 70) {
    return {
      title: '안정적인 실전 컨디션',
      summary: '전체적으로 괜찮다. 무리만 안 하면 오늘 해야 할 일은 꽤 잘 풀릴 가능성이 높아.',
      action: '핵심 업무 1~2개에 힘을 주고, 나머지는 가볍게 정리하는 식이 좋아.',
      caution: `${weakest.label} 쪽이 발목을 잡을 수 있으니 초반에 한 번 보정해두면 좋아.`,
      strongest,
      weakest,
    }
  }

  if (score >= 55) {
    return {
      title: '기능은 하지만 배려가 필요한 날',
      summary: '완전히 나쁘진 않지만, 에너지를 분산해서 쓰면 생각보다 빨리 지칠 수 있어.',
      action: '할 일을 잘게 쪼개고, 빠르게 끝낼 수 있는 것부터 리듬을 만드는 게 좋아.',
      caution: `${weakest.label} 지표가 낮아서 억지로 몰아붙이면 체감 피로가 커질 수 있어.`,
      strongest,
      weakest,
    }
  }

  return {
    title: '회복을 우선해야 하는 날',
    summary: '오늘은 성과보다 복구가 중요해 보여. 억지로 밀면 효율보다 소모가 더 커질 수 있어.',
    action: '일정을 줄이고, 물, 식사, 햇빛, 짧은 낮잠 같은 기본 회복 행동부터 챙겨.',
    caution: `${weakest.label} 신호가 강하게 떨어져 있어. 오늘은 스스로를 덜 몰아붙이는 게 맞아.`,
    strongest,
    weakest,
  }
}

function getScore(values) {
  const total = metrics.reduce((sum, metric) => {
    const raw = values[metric.key]
    const normalized = metric.reverse ? 11 - raw : raw
    return sum + normalized
  }, 0)

  return Math.round((total / (metrics.length * 10)) * 100)
}

function App() {
  const [step, setStep] = useState(0)
  const [values, setValues] = useState(defaultValues)

  const score = useMemo(() => getScore(values), [values])
  const condition = useMemo(() => getCondition(score), [score])
  const interpretation = useMemo(() => getInterpretation(score, values), [score, values])

  const currentMetric = metrics[step]
  const isComplete = step >= metrics.length
  const progress = Math.round((Math.min(step, metrics.length) / metrics.length) * 100)

  const handleChange = (value) => {
    setValues((prev) => ({
      ...prev,
      [currentMetric.key]: Number(value),
    }))
  }

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, metrics.length))
  }

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0))
  }

  const handleRestart = () => {
    setValues(defaultValues)
    setStep(0)
  }

  return (
    <main className="page-shell">
      <section className="frame-card">
        <header className="topbar">
          <div>
            <span className="eyebrow">0414 Condition Checker</span>
            <h1>오늘의 컨디션 체크</h1>
          </div>
          <div className="progress-cluster">
            <span className="progress-copy">{isComplete ? '분석 완료' : `${step + 1} / ${metrics.length}`}</span>
            <div className="progress-track" aria-hidden="true">
              <span style={{ width: `${isComplete ? 100 : progress}%` }} />
            </div>
          </div>
        </header>

        {!isComplete ? (
          <section className={`question-card ${currentMetric.gradient}`}>
            <div className="question-meta">
              <div className="metric-badge-row">
                <span className="metric-badge">{currentMetric.shortLabel}</span>
                <div className="metric-tags">
                  {currentMetric.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <p className="metric-deco">{currentMetric.deco}</p>
            </div>

            <div className="question-main">
              <div className="question-copy">
                <span className="question-emoji">{currentMetric.emoji}</span>
                <h2>{currentMetric.question}</h2>
                <p>{currentMetric.hint}</p>
              </div>

              <div className="slider-panel">
                <div className="value-showcase" style={{ '--accent': currentMetric.accent }}>
                  <strong>{values[currentMetric.key]}</strong>
                  <span>/ 10</span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="10"
                  value={values[currentMetric.key]}
                  onChange={(event) => handleChange(event.target.value)}
                  style={{ '--accent': currentMetric.accent }}
                />

                <div className="range-labels">
                  <span>{currentMetric.options[0]}</span>
                  <span>{currentMetric.options[1]}</span>
                </div>
              </div>
            </div>

            <footer className="question-actions">
              <button type="button" className="ghost-button" onClick={handleBack} disabled={step === 0}>
                이전
              </button>
              <button type="button" className="primary-button" onClick={handleNext}>
                {step === metrics.length - 1 ? '해석 보기' : '다음 질문'}
              </button>
            </footer>
          </section>
        ) : (
          <section className="result-card">
            <div className="result-hero">
              <div>
                <span className={`result-pill ${condition.tone}`}>{condition.label}</span>
                <h2>{interpretation.title}</h2>
                <p>{interpretation.summary}</p>
              </div>
              <div className={`score-orb ${condition.tone}`}>
                <strong>{score}</strong>
                <span>오늘의 점수</span>
              </div>
            </div>

            <div className="result-grid">
              <article className="result-panel highlight-panel">
                <span className="panel-kicker">Best signal</span>
                <h3>
                  {interpretation.strongest.emoji} {interpretation.strongest.label}
                </h3>
                <p>
                  오늘 가장 받쳐주는 축이야. 지금 점수는 <strong>{interpretation.strongest.raw}/10</strong>.
                </p>
              </article>

              <article className="result-panel soft-panel">
                <span className="panel-kicker">Watch closely</span>
                <h3>
                  {interpretation.weakest.emoji} {interpretation.weakest.label}
                </h3>
                <p>
                  여기가 오늘의 병목일 가능성이 커. 지금 점수는 <strong>{interpretation.weakest.raw}/10</strong>.
                </p>
              </article>

              <article className="result-panel action-panel">
                <span className="panel-kicker">오늘의 추천</span>
                <h3>이렇게 가면 좋아</h3>
                <p>{interpretation.action}</p>
              </article>

              <article className="result-panel caution-panel">
                <span className="panel-kicker">주의 포인트</span>
                <h3>무리만 피하자</h3>
                <p>{interpretation.caution}</p>
              </article>
            </div>

            <div className="metric-summary-list">
              {metrics.map((metric) => (
                <div key={metric.key} className="mini-metric">
                  <span>
                    {metric.emoji} {metric.label}
                  </span>
                  <strong>{values[metric.key]}</strong>
                </div>
              ))}
            </div>

            <footer className="question-actions result-actions">
              <button type="button" className="ghost-button" onClick={handleRestart}>
                처음부터 다시
              </button>
            </footer>
          </section>
        )}
      </section>
    </main>
  )
}

export default App
