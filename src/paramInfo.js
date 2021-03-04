// https://developer.spotify.com/documentation/web-api/reference/#object-audiofeaturesobject
const paramFullNames = new Map([
  ['bpm', 'tempo'],
  ['nrgy', 'energy'],
  ['live', 'liveness'],
  ['dnce', 'danceability'],
  ['val', 'valence'],
  ['dur', 'duration'],
  ['acous', 'acousticness'],
  ['spch', 'speechiness'],
  ['pop', 'popularity'],
]);

const paramFullNamesCompact = new Map([
  ['bpm', ['tempo']],
  ['nrgy', ['energy']],
  ['live', ['liveness']],
  ['dnce', ['dancea-', 'bility']],
  ['val', ['valence']],
  ['dur', ['duration']],
  ['acous', ['acoustic-', 'ness']],
  ['spch', ['speechi-', 'ness']],
  ['pop', ['popularity']],
]);

export { paramFullNames, paramFullNamesCompact };
