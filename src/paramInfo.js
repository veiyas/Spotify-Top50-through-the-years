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

export { paramFullNames };
