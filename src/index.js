import { csv, select } from 'd3';
import ParallelCoord from './ParallelCoord';
import './style.scss';

const main = async () => {
  select('#test').text('Newwww');

  try {
    const data = await csv('data/top50s.csv');

    const pc = new ParallelCoord(data, 'parallel-coord', propsToUsePC);
  } catch (err) {
    console.error(err);
  }
};

main();

const propsToUsePC = new Set([
  'bpm',
  'nrgy',
  'dnce',
  'dB',
  'live',
  'val',
  'dur',
  'acous',
  'spch',
  'pop',
]);
