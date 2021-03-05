import { csv } from 'd3';
import ParallelCoord from './ParallelCoord';
import Timeline from './timeline';
import DBSCAN from './DBSCAN';
import './style.scss';

const main = async () => {
  try {
    const data = await csv('data/top50s.csv');

    // Attach cluster as object property for all entries
    DBSCAN(data);

    // Create visual elements
    const pc = new ParallelCoord(data, 'parallel-coord', propsToUsePC);
    const tl = new Timeline(data, 'timeline', propsToUseTL, pc);
    // var rp = new RadarPlot(
    //   data[Math.floor(Math.random() * data.length)],
    //   'radar-plot'
    // );
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
  // 'pop',
]);

// TODO I tried changing this and absolutely nothing happened
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
