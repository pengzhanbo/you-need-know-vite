import React, { useState, useEffect } from 'react'
import mermaid from 'mermaid'

let uuid = 0

export default function Mermaid({ chart }) {
  const [svg, setSVG] = useState('')

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'forest'
    })
    mermaid.render(
      `mermaid-svg-${uuid}`,
      chart,
    ).then(({svg}) => setSVG(svg))
    uuid++
  }, [chart])

  return <div
    className='flex justify-center pt-5'
    dangerouslySetInnerHTML={{ __html: svg }}
  />
}
