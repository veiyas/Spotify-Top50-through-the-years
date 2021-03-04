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

/** Name of dimensions with values up to 100 */
const hundredRange = new Set([
  'nrgy',
  'pop',
  'spch',
  'acous',
  'val',
  'live',
  'dnce',
]);

export { paramFullNames, hundredRange };
