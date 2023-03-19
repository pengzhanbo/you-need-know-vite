import React, { useState, useEffect } from 'react'
import mermaid from 'mermaid'
import { useTheme } from 'nextra-theme-docs'

let uuid = 0

export default function Mermaid({ chart, theme = 'default' }: MermaidProps) {
  const [svg, setSVG] = useState('')
  const { theme: themeMode } = useTheme()

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: themeMode === 'dark' ? 'dark' : theme
    })
    mermaid.render(
      `mermaid-svg-${uuid}`,
      chart,
    ).then(({svg}) => setSVG(svg))
    uuid++
  }, [chart, theme, themeMode])

  return <div
    className='flex justify-center pt-5'
    dangerouslySetInnerHTML={{ __html: svg }}
  />
}

export type MermaidProps = {
  chart: string
  theme?: 'default' | 'neutral' | 'dark' | 'forest' | 'base'
}
