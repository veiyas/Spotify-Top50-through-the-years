import {min, max, extent} from 'd3';

export default function mainDBSCAN(dataset) {
    var data = parseData(dataset);
    const eps = 45;
    const minPts = 20;
    var label = []; //label datapoints to which cluster they belong. undefined = not visited, 0 = noise.
    var clusterIndex = 0; //Cluster counter. Cluster 0 is noise data points.
    const dist = euclideanDistance;

    // const mmbpm = extent(data, d => d.bpm),
    // mmnrgy = extent(data, d => d.nrgy),
    // mmdnce = extent(data, d => d.dnce),
    // mmlive = extent(data, d => d.live),
    // mmval = extent(data, d => d.val),
    // mmacous = extent(data, d => d.acous),
    // mmpop = extent(data, d => d.pop);      

    // //Trying normalizing data
    // data.forEach(d => {
    //     d.bpm = normalize(d.bpm, mmbpm)
    //     d.nrgy = normalize(d.nrgy, mmnrgy)
    //     d.dnce = normalize(d.dnce, mmdnce)
    //     d.live = normalize(d.live, mmlive)
    //     d.val = normalize(d.val, mmval)
    //     d.acous = normalize(d.acous, mmacous)
    //     d.pop = normalize(d.pop, mmpop) 
    // });

    // function normalize(val, minmax) {
    //     return ((val-minmax[0]) / (minmax[1] - minmax[0]))
    // }



    function parseData(data) {
        data.forEach(d => {
        d.bpm = parseInt(d.bpm);
        d.nrgy = parseInt(d.nrgy);
        d.dnce = parseInt(d.dnce);
        d.dB = parseInt(d.dB);
        d.live = parseInt(d.live);
        d.val = parseInt(d.val);
        d.acous = parseInt(d.acous);
        d.pop = parseInt(d.pop);
        })
        return data;  
    }



    let DBScan = function() {
        //Main loop
        for (let i = 0; i < data.length; i++) {
            let currPoint = data[i];

            // Already visited
            if (label[data.indexOf(currPoint)] !== undefined) { continue; }
            let neighbors = rangeQuery(currPoint);

            // Label as noise
            if (neighbors.length < minPts ) {
                label[data.indexOf(currPoint)] = 0;
                continue;
            }

            clusterIndex++;
            label[data.indexOf(currPoint)] = clusterIndex;

            for (let j = 0; j < neighbors.length; j++) {
                let currNeighbor = neighbors[j];

                // Already visited
                if (label[data.indexOf(currNeighbor)] !== undefined) { continue; }

                // It's not noise anymore!
                if (label[data.indexOf(currNeighbor)] === 0) {
                    label[data.indexOf(currNeighbor)] = clusterIndex;
                    continue;
                }

                label[data.indexOf(currNeighbor)] = clusterIndex;

                let extraNeighbors = rangeQuery(currNeighbor);
                if (extraNeighbors.length >= minPts) {
                    neighbors = neighbors.concat(extraNeighbors);
                }
            }
        }

        for (let i = 0; i < label.length; i++) {
            Object.defineProperty(data[i], 'cluster', {value: label[i]});
        }

        return 'We did it boys, unclustered data is no more!';
    };

    //Calculate the euclidean distance between 2 points
    function euclideanDistance(point1, point2) {
        return Math.sqrt(Math.pow((point1.bpm - point2.bpm), 2) + Math.pow((point1.nrgy - point2.nrgy), 2) +
                        Math.pow((point1.dnce - point2.dnce), 2) + Math.pow((point1.live - point2.live), 2) +
                        Math.pow((point1.val - point2.val), 2) + Math.pow((point1.acous - point2.acous), 2) + Math.pow((point1.pop - point2.pop), 2));
    };

    //Get all points inside epsilon radius of point
    function rangeQuery(point) {
        let neighbours = [];
        for(let i = 0; i < data.length; i++) {
            if(point == data[i]) { //If they are same datapoint
                continue;
            }
            const distance = dist(point, data[i]);
            if(distance <= eps) {
                neighbours.push(data[i]);
            }
        }
        return neighbours;
    };

    return DBScan();
}