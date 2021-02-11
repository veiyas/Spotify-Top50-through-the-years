import { csv, select } from 'd3';
import './style.scss';

const main = async () => {
  select('#test').text('Newwww');

  try {
    const data = await csv('data/top50s.csv');
    console.dir(data);
  } catch (err) {
    console.error(err);
  }
};

main();
