import { send } from './messages'

export interface DeteamsingResult {
  hiddenURL?: string | null,
  downloadURL?: string | null
}

const fromSearchParams = (u: URL): DeteamsingResult => {
  // the assumption is that this is a teams link with an encoded link in searchparams
  const searchParams = u.searchParams
  const hiddenURL = searchParams.get('objectUrl')
  return { hiddenURL }
}

function fromHash (u: URL): DeteamsingResult | undefined {
  const hash = u.hash
  if (!hash.startsWith('#/xlsx/viewer/teams/')) {
    return undefined
  }
  const downloadURL = hash.replace(/^#\/xlsx\/viewer\/teams\//, '').replace(/~2F/g, '/')
  return { downloadURL }
}

// this massively assumes that u is a url and a teams url at that
export const deteamsify = (u: URL): DeteamsingResult | undefined => {
  const objectURL = fromSearchParams(u)
  const viewerURL = fromHash(u)

  if (objectURL.hiddenURL) {
    send('')
    return objectURL
  } else if (viewerURL) {
    send('')
    return viewerURL
  } else {
    send('no hidden URL found in this teams URL, soz. 🤷‍♀️')
  }
}
