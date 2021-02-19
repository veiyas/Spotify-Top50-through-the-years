import { csv, select } from 'd3';
import ParallelCoord from './ParallelCoord';
import RadarPlot from './RadarPlot';
import Timeline from './Timeline';
import './style.scss';

const main = async () => {
  try {
    const data = await csv('data/top50s.csv');

    const pc = new ParallelCoord(data, 'parallel-coord', propsToUsePC);
    const rp = new RadarPlot(
      data[Math.floor(Math.random() * data.length)],
      'radar-plot',
      propsToUseRP
    );
    // const tl = new Timeline(data, 'timeline', propsToUseTL);
  } catch (err) {
    console.error(err);
  }
};

main();

const propsToUsePC = new Set([
  'bpm',
  'nrgy',
  'dnce',
  // 'dB',
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

const propsToUseTL = new Set([
  'bpm',
  'nrgy',
  'dnce',
  'live',
  'val',
  'acous',
  'spch',
  'pop',
]);
