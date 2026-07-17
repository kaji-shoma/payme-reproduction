import './scss/style.scss'

// ==========================================================================
// マウスカーソルからコインが飛び散るアニメーション
// ==========================================================================
const SPAWN_INTERVAL_MS = 80 // 生成間隔(ミリ秒)。短くしすぎると重くなるので間引く
const RAIN_TRIGGER_COUNT = 30 // この枚数に達したらコイン雨イベントを発生させる
const RAIN_COIN_COUNT = 120 // 降らせるコインの枚数

let lastSpawnTime = 0
let coinCount = 0
let isRainTriggered = false

function spawnCoin(x, y) {
  const coin = document.createElement('img')
  coin.className = 'js-coin-particle'
  coin.src = '/src/assets/common/coin.webp'
  coin.alt = ''
  coin.style.left = `${x}px`
  coin.style.top = `${y}px`

  const driftX = Math.random() * 160 - 80
  coin.style.setProperty('--drift-x', `${driftX}px`)

  const duration = 0.8 + Math.random() * 0.4
  coin.style.setProperty('--fall-duration', `${duration}s`)

  const rotate = (Math.random() * 3 + 1) * 360 * (Math.random() < 0.5 ? 1 : -1)
  coin.style.setProperty('--rotate', `${rotate}deg`)

  document.body.appendChild(coin)

  coin.addEventListener('animationend', () => {
    coin.remove()
  })

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
// 100枚到達時の特別演出：画面フラッシュ＋コインの雨
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
  const coin = document.createElement('img')
  coin.className = 'js-coin-rain'
  coin.src = '/src/assets/common/coin.webp'
  coin.alt = ''

  const startX = Math.random() * window.innerWidth -400
  coin.style.left = `${startX}px`

  const duration = 1.2 + Math.random() * 1.2
  coin.style.setProperty('--fall-duration', `${duration}s`)

  const rotate = (Math.random() * 3 + 1) * 360 * (Math.random() < 0.5 ? 1 : -1)
  coin.style.setProperty('--rotate', `${rotate}deg`)

  document.body.appendChild(coin)

  coin.addEventListener('animationend', () => {
    coin.remove()
  })
}

function triggerCoinRain() {
  flashScreen()

  for (let i = 0; i < RAIN_COIN_COUNT; i++) {
    // 発生タイミングを少しずつずらして、雨のように降らせる
    const delay = Math.random() * 1500
    setTimeout(spawnRainCoin, delay)
  }
}

window.addEventListener('mousemove', handleMouseMove)