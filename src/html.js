export const link = (url) => {
  const a = document.createElement('a')
  const linkText = document.createTextNode(url)
  a.appendChild(linkText)
  a.title = url
  a.href = url
  a.target = '_blank'
  return a
}

export const text = (content) => document.createTextNode(content)

export const span = (children) => {
  const s = document.createElement('span')
  for (const c of children) {
    s.appendChild(c)
  }
  return s
}

export const listItem = (child, width = "500px") => {
  const li = document.createElement('li')
  li.width = width
  li.appendChild(child)
  return li
}
