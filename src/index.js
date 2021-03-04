import { csv, select, timeParse } from 'd3';
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
    const tl = new Timeline(data, 'timeline', propsToUseTL, pc); // TODO Fix width and height in Timeline to fit in layout
    // var rp = new RadarPlot(
    //   data[Math.floor(Math.random() * data.length)],
    //   'radar-plot'
    // );

    // // For testing update
    // var parseYear = timeParse('%Y');
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    // pc.setData(
    //   data.filter((d) => d.year.getTime() === parseYear('2017').getTime())
    // );
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    // pc.setData(
    //   data.filter((d) => d.year.getTime() === parseYear('2018').getTime())
    // );
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    // pc.setData(
    //   data.filter((d) => d.year.getTime() === parseYear('2019').getTime())
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
