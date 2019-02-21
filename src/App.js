import React, { Component } from 'react';
import { Button } from 'antd';
import { CSSTransition } from 'react-transition-group'

import Steps from 'components/Steps';
import { Title, WelcomeContainer } from './App.style';
import ThreeContainer from 'components/ThreeContainer';
import './App.css';


class App extends Component {
  state = {
    colorsLoaded: false,
    showTitle: false,
    showButton: true,
    showProgress: false,
    showViewer: false,
    percentageLoaded: 0,
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
    this.toggleProgress()
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

  toggleProgress = () => {
    this.setState({
      showProgress: !this.state.showProgress,
    })
  }

  changePercentage = (percentage) => {
    this.setState({
      percentageLoaded: Math.round(percentage),
    })
  }

  toggleColorsLoaded = () => {
    this.setState({
      colorsLoaded: true,
    })
    this.toggleProgress()
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
        {this.state.showViewer && (
          <ThreeContainer
            changePercentage={this.changePercentage}
            toggleColorsLoaded={this.toggleColorsLoaded}
          />
        )}
        <CSSTransition
          in={this.state.showProgress}
          classNames="progress"
          timeout={1000}
          unmountOnExit
        >
          <Steps
            fileRead={this.state.percentageLoaded === 100}
            colorsLoaded={this.state.colorsLoaded}
          />
        </CSSTransition>
      </div>
    );
  }
}

export default App;
