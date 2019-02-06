/* eslint-disable */
import {
  FileLoader,
  DefaultLoadingManager, 
} from 'three-full';

import { LASFile, LASDecoder } from './LasLaz';

var LasLoader = function ( manager ) {

  this.manager = ( manager !== undefined ) ? manager : DefaultLoadingManager;
  this.littleEndian = true;

};

LasLoader.prototype = {

  constructor: LasLoader,

  load: function ( url, onLoad, onProgress, onError ) {

    var scope = this;

    var loader = new FileLoader( scope.manager );
    loader.setResponseType( 'arraybuffer' );
    loader.load( url, function ( data ) {

      try {

        onLoad( scope.parse( data, url ) );

      } catch ( e ) {

        if ( onError ) {

          onError( e );

        } else {

          throw e;

        }

      }

    }, onProgress, onError );

  },

  parse: async function ( buffer, url ) {
    let lf = new LASFile(buffer);
    lf.open();
    // TODO check let handler = new LasLazBatcher();
    
    var LASHeader = await lf.getHeader();
    var textData = await lf.readData(LASHeader.pointsCount, LASHeader.offset, 0);

    var offset = LASHeader.offset;
    var lasData = textData.buffer;
    var decoder = new LASDecoder(
      lasData,
      LASHeader.pointsFormatId,
      LASHeader.pointsStructSize,
      LASHeader.pointsCount,
      LASHeader.pointsCount,
      LASHeader.scale,
      LASHeader.offset,
      LASHeader.mins,
      LASHeader.maxs,
    );

    var position = [];
    var color = [];

    for ( var i = 0, l = LASHeader.pointsCount - 1; i < l; i ++ ) {
      var point = decoder.getPoint(i);
      var pointPosition = point.position;
      var pointPositionX =
        (pointPosition[0] * LASHeader.scale[0])
        + LASHeader.offset[0] - LASHeader.mins[0];
      var pointPositionY =
        (pointPosition[1] * LASHeader.scale[1])
        + LASHeader.offset[1] - LASHeader.mins[1];
      var pointPositionZ =
        (pointPosition[2] * LASHeader.scale[2])
        + LASHeader.offset[2] - LASHeader.mins[2];
      var colorR = point.color[0] / 65535;
      var colorG = point.color[1] / 65535;
      var colorB = point.color[2] / 65535;
      position.push(pointPositionX);
      position.push(pointPositionY);
      position.push(pointPositionZ);
      color.push(colorR);
      color.push(colorG);
      color.push(colorB);
    }
    const pointCloud = { position, color }

    return pointCloud
  },
};

export { LasLoader }
