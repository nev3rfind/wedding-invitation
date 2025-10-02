<template>
  <canvas
    ref="canvasRef"
    :id="canvasId"
    class="pointer-events-none absolute inset-0 mx-auto"
  ></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  canvasId: {
    type: String,
    default: 'animated-canvas'
  }
})

const canvasRef = ref(null)
let ctx = null
let f = null
let e = 0
const pos = {}
let lines = []
const E = {
  debug: true,
  friction: 0.5,
  trails: 80,
  size: 50,
  dampening: 0.025,
  tension: 0.99,
}

function Node() {
  this.x = 0
  this.y = 0
  this.vy = 0
  this.vx = 0
}

function SineWave(config) {
  this.init(config || {})
}

SineWave.prototype = {
  init: function (config) {
    this.phase = config.phase || 0
    this.offset = config.offset || 0
    this.frequency = config.frequency || 0.001
    this.amplitude = config.amplitude || 1
  },
  update: function () {
    this.phase += this.frequency
    e = this.offset + Math.sin(this.phase) * this.amplitude
    return e
  },
  value: function () {
    return e
  },
}

function Line(config) {
  this.init(config || {})
}

Line.prototype = {
  init: function (config) {
    this.spring = config.spring + 0.1 * Math.random() - 0.05
    this.friction = E.friction + 0.01 * Math.random() - 0.005
    this.nodes = []
    for (let i = 0; i < E.size; i++) {
      const t = new Node()
      t.x = pos.x
      t.y = pos.y
      this.nodes.push(t)
    }
  },
  update: function () {
    let e = this.spring
    let t = this.nodes[0]
    t.vx += (pos.x - t.x) * e
    t.vy += (pos.y - t.y) * e
    for (let i = 0, a = this.nodes.length; i < a; i++) {
      t = this.nodes[i]
      if (i > 0) {
        const n = this.nodes[i - 1]
        t.vx += (n.x - t.x) * e
        t.vy += (n.y - t.y) * e
        t.vx += n.vx * E.dampening
        t.vy += n.vy * E.dampening
      }
      t.vx *= this.friction
      t.vy *= this.friction
      t.x += t.vx
      t.y += t.vy
      e *= E.tension
    }
  },
  draw: function () {
    let e, t
    let n = this.nodes[0].x
    let i = this.nodes[0].y
    ctx.beginPath()
    ctx.moveTo(n, i)
    for (let a = 1, o = this.nodes.length - 2; a < o; a++) {
      e = this.nodes[a]
      t = this.nodes[a + 1]
      n = 0.5 * (e.x + t.x)
      i = 0.5 * (e.y + t.y)
      ctx.quadraticCurveTo(e.x, e.y, n, i)
    }
    e = this.nodes[a]
    t = this.nodes[a + 1]
    ctx.quadraticCurveTo(e.x, e.y, t.x, t.y)
    ctx.stroke()
    ctx.closePath()
  },
}

function onMousemove(event) {
  function initLines() {
    lines = []
    for (let i = 0; i < E.trails; i++) {
      lines.push(new Line({ spring: 0.45 + (i / E.trails) * 0.025 }))
    }
  }

  function updatePos(e) {
    if (e.touches) {
      pos.x = e.touches[0].pageX
      pos.y = e.touches[0].pageY
    } else {
      pos.x = e.clientX
      pos.y = e.clientY
    }
    e.preventDefault()
  }

  function handleTouch(e) {
    if (e.touches.length === 1) {
      pos.x = e.touches[0].pageX
      pos.y = e.touches[0].pageY
    }
  }

  document.removeEventListener('mousemove', onMousemove)
  document.removeEventListener('touchstart', onMousemove)
  document.addEventListener('mousemove', updatePos)
  document.addEventListener('touchmove', updatePos)
  document.addEventListener('touchstart', handleTouch)
  updatePos(event)
  initLines()
  render()
}

function render() {
  if (ctx.running) {
    ctx.globalCompositeOperation = 'source-over'
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.globalCompositeOperation = 'lighter'
    ctx.strokeStyle = 'hsla(' + Math.round(f.update()) + ',100%,50%,0.025)'
    ctx.lineWidth = 10
    for (let t = 0; t < E.trails; t++) {
      const line = lines[t]
      line.update()
      line.draw()
    }
    ctx.frame++
    window.requestAnimationFrame(render)
  }
}

function resizeCanvas() {
  if (ctx && ctx.canvas) {
    ctx.canvas.width = window.innerWidth - 20
    ctx.canvas.height = window.innerHeight
  }
}

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')
    ctx.running = true
    ctx.frame = 1
    f = new SineWave({
      phase: Math.random() * 2 * Math.PI,
      amplitude: 85,
      frequency: 0.0015,
      offset: 285,
    })

    document.addEventListener('mousemove', onMousemove)
    document.addEventListener('touchstart', onMousemove)
    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('focus', () => {
      if (!ctx.running) {
        ctx.running = true
        render()
      }
    })
    window.addEventListener('blur', () => {
      ctx.running = true
    })

    resizeCanvas()
  }
})

onUnmounted(() => {
  if (ctx) {
    ctx.running = false
  }
  document.removeEventListener('mousemove', onMousemove)
  document.removeEventListener('touchstart', onMousemove)
  window.removeEventListener('resize', resizeCanvas)
})
</script>
