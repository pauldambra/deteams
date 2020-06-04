import * as maquette from 'maquette'
import { fromEvent } from 'rxjs'
import { filter, debounceTime, map } from 'rxjs/operators'
import { isTeamsLink, isValidHttpUrl, mightContainASecretHiddenLink } from './url'
import { deteamsify } from './deteamsifier'

const h = maquette.h
const projector = maquette.createProjector()

const render = () => h('div.main', [
  h('div.title', [
    h('h1', ['Deteams your teams links'])
  ]),
  h('section', [
    h('p'),
    h('input.undeteamsified', []),
    h('div.output', [
      h('div.message', []),
      h('div.links', [
        h('ul', [])
      ])
    ])
  ])
])

const onError = e => {
  document.getElementsByClassName('message')[0].innerHTML = e.message
}

const createLink = s => {
  const a = document.createElement('a')
  const linkText = document.createTextNode(s)
  a.appendChild(linkText)
  a.title = s
  a.href = s
  a.target = '_blank'
  return a
}

const li = child => {
  const li = document.createElement('li')
  li.appendChild(child)
  return li
}

const onNext = s => {
  const ul = document.getElementsByClassName('links')[0].children[0]
  const li = li(createLink(s))
  ul.appendChild(li);
}

const wiring = () => {
  fromEvent(document.getElementsByClassName('undeteamsified'), 'input')
    .pipe(
      debounceTime(200),
      map(x => x.target.value),
      filter(isValidHttpUrl),
      map(u => new URL(u)),
      filter(isTeamsLink),
      filter(mightContainASecretHiddenLink),
      map(deteamsify)
    )
    .subscribe(onNext, onError)

}

/**
 * ok on input even check if it's a link
 * then check that it's a teams link
 * then see if it has a link inside it
 * put a message in the UI if it is
 * if the message is some feedback it goes in "slot 0" at the top of the output
 * if the message is a deteams'd link then it goes at the top of slot 1, keeping previous items below it
 */

const writeToDOMWhenReady = () => {
  document.addEventListener('DOMContentLoaded', () => {
    projector.append(document.body, render)
    wiring()
  })
}

writeToDOMWhenReady()
