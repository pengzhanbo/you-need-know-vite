import type { DocsThemeConfig } from 'nextra-theme-docs'
// import { useConfig } from 'nextra-theme-docs'
import { useRouter } from 'next/router'

const logo = (
  <>
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><g fill="none"><path fill="url(#vscodeIconsFileTypeVite0)" d="m29.884 6.146l-13.142 23.5a.714.714 0 0 1-1.244.005L2.096 6.148a.714.714 0 0 1 .746-1.057l13.156 2.352a.714.714 0 0 0 .253 0l12.881-2.348a.714.714 0 0 1 .752 1.05z"/><path fill="url(#vscodeIconsFileTypeVite1)" d="M22.264 2.007L12.54 3.912a.357.357 0 0 0-.288.33l-.598 10.104a.357.357 0 0 0 .437.369l2.707-.625a.357.357 0 0 1 .43.42l-.804 3.939a.357.357 0 0 0 .454.413l1.672-.508a.357.357 0 0 1 .454.414l-1.279 6.187c-.08.387.435.598.65.267l.143-.222l7.925-15.815a.357.357 0 0 0-.387-.51l-2.787.537a.357.357 0 0 1-.41-.45l1.818-6.306a.357.357 0 0 0-.412-.45z"/><defs><linearGradient id="vscodeIconsFileTypeVite0" x1="6" x2="235" y1="33" y2="344" gradientTransform="translate(1.34 1.894) scale(.07142)" gradientUnits="userSpaceOnUse"><stop stopColor="#41D1FF"/><stop offset="1" stopColor="#BD34FE"/></linearGradient><linearGradient id="vscodeIconsFileTypeVite1" x1="194.651" x2="236.076" y1="8.818" y2="292.989" gradientTransform="translate(1.34 1.894) scale(.07142)" gradientUnits="userSpaceOnUse"><stop stopColor="#FFEA83"/><stop offset=".083" stopColor="#FFDD35"/><stop offset="1" stopColor="#FFA800"/></linearGradient></defs></g></svg>
  <span style={{ marginLeft: '1em', fontWeight: 800 }}>You Need Know Vite</span>
  </>
)

const config: DocsThemeConfig = {
  logo,
  useNextSeoProps() {
    const { asPath } = useRouter()
    if (asPath !== '/') {
      return {
        titleTemplate: '%s – You-Need-Know-Vite'
      }
    }
  },
  project: {
    link: 'https://github.com/pengzhanbo/you-need-know-vite',
  },
  // chat: {
  //   link: 'https://discord.com',
  // },
  docsRepositoryBase: 'https://github.com/pengzhanbo/you-need-know-vite',
  darkMode: true,
  primaryHue: 210,
  search: {
    placeholder: '文档搜索'
  },
  head: function useHead() {
    return (
      <>
        <meta name="msapplication-TileColor" content="#fff" />
        <meta name="theme-color" content="#fff" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Language" content="zh-CN" />
        <meta
          name="description"
          content="You-Need-Know-Vite"
        />
      </>
    )
  },
  editLink: {
    text: '在GitHub中编辑此页面 →'
  },
  feedback: {
    content: '遇到问题？请给我反馈 →',
    labels: 'feedback'
  },
  sidebar: {
    titleComponent({ title, type }) {
      if (type === 'separator') {
        return <span className="cursor-default">{title}</span>
      }
      return <>{title}</>
    },
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  footer: {
    text: (
      <p className="text-xs">
        copyright © {new Date().getFullYear()}-present pengzhanbo.
      </p>
    ),
  },
}

export default config