const fs = require( 'fs' );
const path = require( 'path' );
const { createCanvas, registerFont } = require( "canvas" );

// utils
const setupMeasureText = ( fontFamily = 'Helvetica', fontSize = '12px' ) => {
    registerFont(
        path.join( __dirname, '/Helvetica.ttf' ),
        {
            family: 'Helvetica'
        }
    );
    const canvas = createCanvas( 250, 250 );
    const ctx = canvas.getContext( "2d" );
    ctx.font = `normal ${fontSize} ${fontFamily}`;
    return text => ctx.measureText( text ).width;
};

const mText = setupMeasureText();

// import and format the data
let englishTenThousand = fs.readFileSync(
    './google-10000-english.txt',
    {
        encoding: 'utf8',
        flag: 'r'
    }
);
englishTenThousand = englishTenThousand.replaceAll( '\r', '' );
englishTenThousand = englishTenThousand.split( '\n' );
englishTenThousand.pop( englishTenThousand.length - 1 );
const chars = englishTenThousand.join( ' ' ).split( '' );

// build the data object and get frequency
const data = chars.reduce( ( data, char ) => {
    if ( data.hasOwnProperty( char ) ) {
        ++data[char].frequency;
    } else {
        data[char] = {
            frequency: 1
        };
    }
    return data;
}, {} );

// count the data
const N = Object.values( data ).reduce( ( N, char ) => N + char.frequency, 0 );

// determine probability for each character
for ( const [k, v] of Object.entries( data ) ) {
    data[k].probability = v.frequency / N;
}

// measure the width of each character
for ( const k of Object.keys( data ) ) {
    data[k].width = mText( k );
}

fs.writeFileSync(
    path.join( __dirname, '/charFrequency.json' ),
    JSON.stringify( {
        keys: Object.keys( data ).sort(),
        N: N,
        data: data
    } )
);
