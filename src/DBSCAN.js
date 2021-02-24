
export default function mainDBSCAN(dataset) {
    var data = parseData(dataset);

    const eps = 30;
    const minPts = 20;
    var label = []; //label datapoints to which cluster they belong. undefined = not visited, 0 = noise.
    var clusterIndex = 0; //Cluster counter. Cluster 0 is noise data points.
    const dist = euclideanDistance;

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

    // let DBScan = function() {
    //     //Main loop
    //     //For each point in dataset
    //     for(let i = 0; i < data.length; i++){ //i is the index in data
    //         let cp = data[i]; //Current point 
    //         //Check if the datapoint has already been visited
    //         if(label[i] === undefined) { //Has not been visited yet
    //             label[i] = 0; //Mark as visited and noise by default. 
    //             //if not visited, find its neighbours, aka points inside epsilon radius
    //             const neighbours = rangeQuery(cp);
    //             //Check size of neigbours, if bigger than minpts
    //             if(neighbours.length >= minPts) { //If it is a core point
    //                 //Expand around cluster and store the cluster in array
    //                 clusterIndex++; //Add a new cluster
    //                 clusters.push([]); //Expand cluster array

    //                 expandCluster(i, clusterIndex, neighbours);
    //             } else {
    //                 label[i] = 0; //label as noise
    //             }
    //         }
    //     }
    //     return [label, clusters];
    // };

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

    //Expand the initial cluster 
    function expandCluster(dIndex, cIndex, neighbours) {
        clusters[cIndex].push(dIndex) //add the point to the cluster
        label[dIndex] = cIndex; //Assign cluster to index

        for(let i = 0; i < neighbours.length; i++) {
            var currPointIndex = neighbours[i];
            console.log(label[currPointIndex])

            //when if(currNeighbours.length >= minPts) fails and we dont call expandCluster anymore, we just assign the current point to the current cluster
            if(label[currPointIndex] == 0) {
                clusters[cIndex].push(dIndex);
                label[currPointIndex] = cIndex;                
            }

            if(label[currPointIndex] === undefined) { //Check if visited, if not then
                label[currPointIndex] = cIndex; //Mark as visited and as noise by default. Will be added to a cluster late if it is a core point
                let currNeighbours = rangeQuery(currPointIndex);

                if(currNeighbours.length >= minPts) { //Check if core point
                    expandCluster(currPointIndex, cIndex, currNeighbours); //Expand the cluster from the new core point
                }
            }
        }
    };

    return DBScan();
}