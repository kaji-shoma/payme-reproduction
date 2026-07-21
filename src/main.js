import './scss/style.scss'

// ==========================================================================
// マウスカーソルからコインが飛び散るアニメーション
// ==========================================================================
const SPAWN_INTERVAL_MS = 80 // 生成間隔(ミリ秒)。短くしすぎると重くなるので間引く
const RAIN_TRIGGER_COUNT = 30 // この枚数に達したらコイン雨イベントを発生させる
const RAIN_COIN_COUNT = 120 // 降らせるコインの枚数

const COIN_DRIFT_MAX_PX = 80 // マウス追従コインが左右にドリフトする最大距離(px)
const COIN_FALL_DURATION_MIN_S = 0.8 // マウス追従コインの落下時間の最小値(秒)
const COIN_FALL_DURATION_RANGE_S = 0.4 // 落下時間の最小値からの追加幅(秒)。最大は MIN + RANGE

const ROTATION_MIN_TURNS = 1 // コインの回転数の最小値(周)
const ROTATION_EXTRA_TURNS_RANGE = 3 // 回転数の最小値からの追加幅(周)。最大は MIN + RANGE
const DEGREES_PER_TURN = 360

const RAIN_START_X_OFFSET_PX = 400 // 雨コインの出現範囲を画面左端よりさらに外側まで広げるオフセット(px)
const RAIN_FALL_DURATION_MIN_S = 1.2 // 雨コインの落下時間の最小値(秒)
const RAIN_FALL_DURATION_RANGE_S = 1.2 // 落下時間の最小値からの追加幅(秒)。最大は MIN + RANGE
const RAIN_SPAWN_DELAY_MAX_MS = 1500 // 雨コインが降り始めるタイミングをずらす最大幅(ミリ秒)

let lastSpawnTime = 0
let coinCount = 0
let isRainTriggered = false

// 回転数(1〜1+EXTRA周)×360度を、時計回り/反時計回りランダムで返す
function getRandomRotationDeg() {
  return (
    (Math.random() * ROTATION_EXTRA_TURNS_RANGE + ROTATION_MIN_TURNS) * DEGREES_PER_TURN * (Math.random() < 0.5 ? 1 : -1)
  )
}

// コイン画像要素を生成し、アニメーション終了時に自動で取り除かれるようにする
function createCoinElement(className) {
  const coin = document.createElement('img')
  coin.className = className
  coin.src = '/src/assets/common/coin.webp'
  coin.alt = ''

  coin.addEventListener('animationend', () => {
    coin.remove()
  })

  return coin
}

function spawnCoin(x, y) {
  const coin = createCoinElement('js-coin-particle')
  coin.style.left = `${x}px`
  coin.style.top = `${y}px`

  const driftX = Math.random() * COIN_DRIFT_MAX_PX * 2 - COIN_DRIFT_MAX_PX
  coin.style.setProperty('--drift-x', `${driftX}px`)

  const duration = COIN_FALL_DURATION_MIN_S + Math.random() * COIN_FALL_DURATION_RANGE_S
  coin.style.setProperty('--fall-duration', `${duration}s`)

  coin.style.setProperty('--rotate', `${getRandomRotationDeg()}deg`)

  document.body.appendChild(coin)

  coinCount++
  if (!isRainTriggered && coinCount >= RAIN_TRIGGER_COUNT) {
    isRainTriggered = true
    window.removeEventListener('mousemove', handleMouseMove)
    triggerCoinRain()
  }
}

function handleMouseMove(event) {
  const now = performance.now()
  if (now - lastSpawnTime < SPAWN_INTERVAL_MS) return
  lastSpawnTime = now

  spawnCoin(event.clientX, event.clientY)
}

// ==========================================================================
// 枚数到達時の特別演出：画面フラッシュ＋コインの雨
// ==========================================================================
function flashScreen() {
  const flash = document.createElement('div')
  flash.className = 'js-screen-flash'
  document.body.appendChild(flash)

  flash.addEventListener('animationend', () => {
    flash.remove()
  })
}

function spawnRainCoin() {
  const coin = createCoinElement('js-coin-rain')

  const startX = Math.random() * window.innerWidth - RAIN_START_X_OFFSET_PX
  coin.style.left = `${startX}px`

  const duration = RAIN_FALL_DURATION_MIN_S + Math.random() * RAIN_FALL_DURATION_RANGE_S
  coin.style.setProperty('--fall-duration', `${duration}s`)

  coin.style.setProperty('--rotate', `${getRandomRotationDeg()}deg`)

  document.body.appendChild(coin)
}

function triggerCoinRain() {
  flashScreen()

  for (let i = 0; i < RAIN_COIN_COUNT; i++) {
    // 発生タイミングを少しずつずらして、雨のように降らせる
    const delay = Math.random() * RAIN_SPAWN_DELAY_MAX_MS
    setTimeout(spawnRainCoin, delay)
  }
}

window.addEventListener('mousemove', handleMouseMove)
