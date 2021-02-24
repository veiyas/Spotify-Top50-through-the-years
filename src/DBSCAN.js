
export const mainDBSCAN = function(dataset){
    var data = parseData(dataset);

    const eps;
    const minPts;
    var label = []; //label datapoints to which cluster they belong. undefined = not visited, 0 = noise.
    var clusters = []; //Array to store the clusters¨. It only stores the index of the datapoints
    var clusterIndex = 1; //CLuster counter. Cluster 0 is noise data points.
    const dist = euclideanDistance;

    function parseData(data){
        data.forEach(d => {
        d.year = parseInt(d.year);
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

    let DBScan = function(){

        //Main loop
        //For each point in dataset
        for(let i = 0; i < data.length; i++){ //i is the index in data
            let cp = data[i]; //Current point 
            //Check if the datapoint has already been visited
            if(label[i] === undefined){ //Has not been visited yet
                label[i] = 0; //Mark as visited and noise by default. 
                //if not visited, find its neighbours, aka points inside epsilon radius
                const neighbours = rangeQuery(cp);
                //Check size of neigbours, if bigger than minpts
                if(neighbours.length >= minPts){ //If it is a core point
                    //Expand around cluster and store the cluster in array
                    clusterIndex++; //Add a new cluster
                    expandCluster(i, clusterIndex, neighbours);
                } else{
                    label[i] = 0; //label as noise
                }
            }
        }
        return [label, clusters];
    };


    //Calculate the euclidean distance between 2 points
    function euclideanDistance(point1, point2){ 

        return Math.sqrt(Math.pow((point1.year - point2.year), 2)+ Math.pow((point1.bpm - point2.bpm), 2)+ Math.pow((point1.nrgy - point2.nrgy), 2)+
                        Math.pow((point1.dnce - point2.dnce), 2)+ Math.pow((point1.dB - point2.dB), 2)+ Math.pow((point1.live - point2.live), 2)+
                        Math.pow((point1.val - point2.val), 2)+ Math.pow((point1.acous - point2.acous), 2)+ Math.pow((point1.pop - point2.pop), 2));
    
    };

    //Get all points inside epsilon radius of point
    function rangeQuery(point){ 
        let neighbours = []; 

        for(let i = 0; i < data.length; i++){
            if(point == data[i]){ //If they are same datapoint
                continue;
            }
            if(dist(point, data[i]) <= eps){
                neighbours.push(data[i]);
            }
        }
        return neighbours;
    };

    //Expand the initial cluster 
    function expandCluster(dIndex, cIndex, neighbours){
        clusters[cIndex].push(dIndex) //add the point to the cluster
        label[dIndex] = cIndex; //Assign cluster to index

        for(let i = 0; i < neighbours.length; i++){
            const currPointIndex = neighbours[i];
            if(label[currPointIndex] === undefined) { //Check if visited, if not then
                label[currPointIndex] = 0; //Mark as visited and as noise by default. Will be added to a cluster late if it is a core point
                let currNeighbours = rangeQuery(currPointIndex);

                if(currNeighbours.length >= minPts) { //Check if core point
                    expandCluster(currPointIndex, cIndex, currNeighbours); //Expand the cluster from the new core point
                }
            }

            if(label[currPointIndex] == 0) { //when if(currNeighbours.length >= minPts) fails and we dont call expandCluster anymore, we just assign the current point to the current cluster
                clusters[cIndex].push(dIndex);
                label[currPointIndex] = cIndex;
            }
        }
    };

    return DBScan;
}