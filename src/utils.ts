export async function npmLatestVersion(name: string) {
  return (await(await fetch(`https://registry.npmjs.org/${name}`)).json())['dist-tags'].latest
}

export async function getLicense() {
  return (await fetch('https://api.github.com/licenses', {
    headers: {
      'Content-Type': 'application/vnd.github+json',
    },
  })).json()
}
