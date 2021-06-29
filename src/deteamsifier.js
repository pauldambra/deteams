import {send} from './messages'

const fromSearchParams = u => {
  // the assumption is that this is a teams link with an encoded link in searchparams
  const searchParams = u.searchParams
  return searchParams.get("objectUrl");
};

function fromHash(u) {
  const hash = u.hash
  if (!hash.startsWith('#/xlsx/viewer/teams/')) {
    return undefined
  }
  return hash.replace(/^#\/xlsx\/viewer\/teams\//, '').replace(/\~2F/g, '/')
}

// this massively assumes that u is a url and a teams url at that
export const deteamsify = u => {
  const objectURL = fromSearchParams(u);
  const viewerURL = fromHash(u)

  if (objectURL || viewerURL) {
    send('')
    return objectURL || viewerURL
  } else {
    send("no hidden URL found in this teams URL, soz. 🤷‍♀️")
  }
}
