import React, { useState, useEffect } from 'react'
import mermaid from 'mermaid'
import { useTheme } from 'nextra-theme-docs'

let uuid = 0

export default function Mermaid({ chart }) {
  const [svg, setSVG] = useState('')
  const { theme } = useTheme()

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: theme === 'dark' ? 'dark' : 'forest'
    })
    mermaid.render(
      `mermaid-svg-${uuid}`,
      chart,
    ).then(({svg}) => setSVG(svg))
    uuid++
  }, [chart, theme])

  return <div
    className='flex justify-center pt-5'
    dangerouslySetInnerHTML={{ __html: svg }}
  />
}
