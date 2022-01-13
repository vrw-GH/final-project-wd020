import { Fireworks } from 'fireworks/lib/react'

export default function Firework() {
  let fxProps = {
    count: 1,
    interval: 1,
    colors: ['#b2e2f8', '#ffcb59'],
    calc: (props, i) => ({
      ...props,
      x: (i + 1) * (window.innerWidth / 2) - (i + 1) * 100,
      y: 200 + Math.random() * 100 - 50 + (i === 2 ? -80 : 0)
    })
  }

  return (
    <div>
      <Fireworks {...fxProps} />
      
    </div>
  )
}
