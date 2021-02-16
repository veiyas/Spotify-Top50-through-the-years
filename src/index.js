import { csv, select } from 'd3';
import ParallelCoord from './ParallelCoord';
import RadarPlot from './RadarPlot';
import './style.scss';

const main = async () => {
  select('#test').text('Newwww');

  try {
    const data = await csv('data/top50s.csv');

    const pc = new ParallelCoord(data, 'parallel-coord', propsToUsePC);
    const rp = new RadarPlot(data[Math.floor(Math.random() * data.length)], 'radar-plot', propsToUseRP);
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

const propsToUseRP = new Set([
  'nrgy',
  'dnce',
  'live',
  'val',
  'acous',
  'spch',
  'pop',
]);
