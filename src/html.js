export const link = s => {
  const a = document.createElement('a')
  const linkText = document.createTextNode(s)
  a.appendChild(linkText)
  a.title = s
  a.href = s
  a.target = '_blank'
  return a
}

export const listItem = child => {
  const li = document.createElement('li')
  li.appendChild(child)
  return li
}
