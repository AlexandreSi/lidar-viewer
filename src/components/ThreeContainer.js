import React, { Component } from 'react';
import threeEntryPoint from 'utils/threeEntryPoint';


export default class ThreeContainer extends Component {

  componentDidMount() {
    threeEntryPoint(this.threeRootElement);
  }

  render() {
    return (
      <div
        style={{ backgroundColor: '#f0f0f0' }}
        ref={(element) => { this.threeRootElement = element; }}
      >
      </div>
    );
  }
}
