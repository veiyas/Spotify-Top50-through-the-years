import { min } from "d3";


function DBSCAN(data){

    const eps;
    const minPts;
    var label = []; //label points as noise or not
    var clusters = []; //Array to store the clusters¨
    var clCounter = 0; //CLuster counter

    //Main loop
    //For each point in dataset
    for(var i = 0; i < data.length; i++){
        //Check if the datapoint has already been visited
        if(label[i] != 0){
            //if not visited, find its neighbours, aka points inside epsilon radius
            var neighbours = rangeQuery(currentDataPoint);
            //Check size of neigbours, if bigger than minpts
            if(neighbours.length >= minPts){
                //Expand around cluster and store the cluster in array
                expandCluster();
            } else{
                label[i] = 0; //label as noise
            }
        }


    }




};

function euclideanDistance(point1, point2){ //Calculate the euclidean distance between 2 points

};

function rangeQuery(point){ //Get all points inside epsilon radius of point

};

function expandCluster(){ //Expand the initial cluster 

};