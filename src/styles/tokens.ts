export const colors = {
  'ivory-crepe': '#FFFFF8',
  'spring-poppy': '#FCB2A9',
  'english-pear': '#B0D5C0',
  'nimble': '#989CA0',
  'gold-accent': '#E2C275',
  'wedding-red': '#FF6B6B',
} as const

export const spacing = {
  hero: {
    titleSize: '7xl',
    dateSize: '4xl',
    greetingSize: '3xl',
    invitationSize: 'xl',
  },
  countdown: {
    numberSize: '5xl',
    labelSize: 'sm',
  },
} as const

export const animations = {
  typewriter: {
    speed: 70,
    deleteSpeed: 40,
    waitTime: 1500,
  },
  portraits: {
    interval: 5000,
    transitionDuration: 1500,
  },
  petals: {
    count: 20,
    duration: 25,
  },
} as const

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const
