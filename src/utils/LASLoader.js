/* eslint-disable */
import {
  FileLoader,
  DefaultLoadingManager,
} from 'three-full';

import { LASFile, LASDecoder } from './LasLaz';

var LasLoader = function ( ) {

  this.manager = DefaultLoadingManager;
  this.littleEndian = true;

};

LasLoader.prototype = {

  constructor: LasLoader,

  load: function ( url, onLoad, onProgress, onError, toggleColorsLoaded ) {

    var scope = this;

    var loader = new FileLoader( scope.manager );
    loader.setResponseType( 'arraybuffer' );
    loader.load( url, function ( data ) {

      try {

        onLoad( scope.parse( data, url ), toggleColorsLoaded );

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
    var scope = this;

    let lasFile = new LASFile(buffer);
    lasFile.open();

    var LASHeader = await lasFile.getHeader();
    var textData = await lasFile.readData(LASHeader.pointsCount, LASHeader.offset, 0);

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

    // load one every four point, for performance issues
    for ( var i = 0, l = LASHeader.pointsCount - 1; i < l; i += 4 ) {
      var point = decoder.getPoint(i);
      position.push(
        (point.position[0] * LASHeader.scale[0])
        + LASHeader.offset[0] - LASHeader.mins[0]
      );
      position.push(
        (point.position[2] * LASHeader.scale[2])
        + LASHeader.offset[2] - LASHeader.mins[2]
      );
      position.push(
        (point.position[1] * LASHeader.scale[1])
        + LASHeader.offset[1] - LASHeader.mins[1]
      );
      color.push(point.color[0] / 65535);
      color.push(point.color[1] / 65535);
      color.push(point.color[2] / 65535);
    }
    const pointCloud = { position, color }

    return pointCloud
  },
};

export { LasLoader }
