import { csv, select } from 'd3';
import ParallelCoord from './ParallelCoord';
import RadarPlot from './RadarPlot';
import Timeline from './timeline';
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
    // TODO Fix width and height in Timeline to fit in layout
    // const tl = new Timeline(data, 'timeline', propsToUseTL);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    pc.setData(data.filter((d) => d.year === '2017'));
    await new Promise((resolve) => setTimeout(resolve, 2000));
    pc.setData(data.filter((d) => d.year === '2018'));
    await new Promise((resolve) => setTimeout(resolve, 2000));
    pc.setData(data.filter((d) => d.year === '2019'));
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
