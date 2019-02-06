import React, { Component } from 'react';
import { Button } from 'antd';
import { CSSTransition } from 'react-transition-group'

import { Title, WelcomeContainer } from './App.style';
import ThreeContainer from 'components/ThreeContainer';
import './App.css';


class App extends Component {
  state = {
    showTitle: false,
    showButton: true,
    showViewer: false,
  }

  componentDidMount() {
    this.setState({
      showButton: false,
      showTitle: true,
    })
  }

  handleClick = () => {
    this.toggleTitle()
    this.toggleButton()
  }

  toggleViewer = () => {
    this.setState({
      showViewer: !this.state.showViewer,
    })
  }

  toggleTitle = () => {
    this.setState({
      showTitle: !this.state.showTitle,
    })
  }

  toggleButton = () => {
    this.setState({
      showButton: !this.state.showButton,
    })
  }

  render() {
    return (
      <div className="App">
        <WelcomeContainer>
          <CSSTransition
            in={this.state.showTitle}
            classNames="title"
            timeout={1200}
            onEntered={() => this.setState({ showButton: true })}
            unmountOnExit
          >
            <Title>Welcome to LiDAR-viewer</Title>
          </CSSTransition>
          <CSSTransition
            in={this.state.showButton}
            classNames="continue-button"
            timeout={1200}
            onExited={this.toggleViewer}
            unmountOnExit
          >
            <Button type="primary" onClick={this.handleClick}>Continue</Button>
          </CSSTransition>
        </WelcomeContainer>
        {this.state.showViewer && <ThreeContainer />}
      </div>
    );
  }
}

export default App;
