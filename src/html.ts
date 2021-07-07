export const link = (url: string): HTMLAnchorElement => {
  const a = document.createElement('a')
  const linkText = document.createTextNode(url)
  a.appendChild(linkText)
  a.title = url
  a.href = url
  a.target = '_blank'
  return a
}

export const text = (content: string): Text => document.createTextNode(content)

export const span = (children: Array<HTMLElement | Text>): HTMLSpanElement => {
  const s = document.createElement('span')
  for (const c of children) {
    s.appendChild(c)
  }
  return s
}

export const listItem = (child: HTMLElement): HTMLElement => {
  const li = document.createElement('li')
  li.appendChild(child)
  return li
}
