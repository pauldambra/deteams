import * as maquette from 'maquette'
import { fromEvent } from 'rxjs';

const h = maquette.h
const projector = maquette.createProjector()

const render = () => h('div.main', [
  h('div.title', [
    h('h1', ['Deteams your teams links'])
  ]),
  h('section', [
    h('p'),
    h('input', []),
    h('button.deteamsify',['Deteamsify']),
    h('div.output', [])
  ])
])

const wiring = () => {
  fromEvent(document, 'input')
    .subscribe(() => console.log('inputted!'));
  fromEvent(document.getElementsByClassName('deteamsify'), 'click')
    .subscribe(()=> console.log('clicked!'))
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
