import React, { Component } from 'react';
import { Title } from './App.style';
import { Button } from 'antd';
import './App.css';
import { CSSTransition } from 'react-transition-group'


class App extends Component {
  state = {
    showTitle: false,
    showButton: true,
  }

  componentDidMount() {
    this.handleClick()
    this.setState({ showButton: false })
  }

  handleClick = () => {
    this.setState({
      showTitle: !this.state.showTitle,
    })
  }

  render() {
    return (
      <div className="App">
        <CSSTransition
          in={this.state.showTitle}
          classNames="title"
          timeout={1200}
          onEntered={() => this.setState({ showButton: true })}
        >
          <Title>Welcome to LiDAR-viewer</Title>
        </CSSTransition>
        <CSSTransition
          in={this.state.showButton}
          classNames="continue-button"
          timeout={1500}
        >
          <Button type="primary" onClick={this.handleClick}>Continue</Button>
        </CSSTransition>
      </div>
    );
  }
}

export default App;
