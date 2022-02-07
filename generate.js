const fs = require( 'fs' );
const path = require( 'path' );

// utils and setup
const weightedRandom = dataSet => {
    const weights = [];

    // iterative cumsum
    for ( let i = 0; i < dataSet.length; ++i ) {
        weights[i] = dataSet[i].weight + ( weights[i - 1] || 0 );
    }

    // scaled random
    const random = Math.random() * weights[weights.length - 1];

    // pick weighted index
    for ( let i = 0; i < weights.length; ++i ) {
        if ( weights[i] > random ) return dataSet[i].item;
    }
};

const setupWRandom = dataSet => {
    let data = Object.entries( dataSet.data ).map( ( [char, v] ) => {
        return {
            item: char,
            weight: v.probability
        };
    } );
    return () => weightedRandom( data );
};

const data = require( './charFrequency.json' );
const wRandom = setupWRandom( data );

const generateSet = ( maxWidth ) => {

};


// generate sample sets
const MAX_WIDTH = data.data.m.width * 2790;
let sets = [];


