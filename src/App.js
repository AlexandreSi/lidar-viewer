import React, { Component } from 'react';
import { Title, Button } from './App.style';
import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">
        <Title>Welcome to LiDAR-viewer</Title>
        <Button type="primary">Hello world!</Button>
      </div>
    );
  }
}

export default App;
