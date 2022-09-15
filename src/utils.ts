export async function npmLatestVersion(name: string) {
  return (await(await fetch(`https://registry.npmjs.org/${name}`)).json())['dist-tags'].latest
}
