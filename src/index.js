import { csv, select } from 'd3';
import ParallelCoord from './ParallelCoord';
import RadarPlot from './RadarPlot';
import Timeline from './timeline';
import DBSCAN from './DBSCAN';
import './style.scss';

const main = async () => {
  try {
    const data = await csv('data/top50s.csv');
    
    // Attach cluster as object property for all entries
    DBSCAN(data);

    // Create visual elements
    const tl = new Timeline(data, 'timeline', propsToUseTL); // TODO Fix width and height in Timeline to fit in layout
    const pc = new ParallelCoord(data, 'parallel-coord', propsToUsePC);
    var rp = new RadarPlot(
      data[Math.floor(Math.random() * data.length)],
      'radar-plot',
      propsToUseRP
    );

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
