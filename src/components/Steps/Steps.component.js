import React from 'react';
import { Steps as AntDesignSteps, Icon } from 'antd';

import { ProgressContainer } from './Steps.style';


const Steps = (props) => {
  const currentStep = props.fileRead ? 1 : 0;

  return (
    <ProgressContainer>
      <AntDesignSteps current={currentStep}>
        <AntDesignSteps.Step title="Reading .LAS file" icon={currentStep === 0 ? <Icon type="loading" /> : <Icon type="file-add" />} />
        <AntDesignSteps.Step title="Loading colors" icon={currentStep === 1 ? <Icon type="loading" /> : <Icon type="bg-colors" />} />
        <AntDesignSteps.Step title="Ready to explore" icon={currentStep === 2 ? <Icon type="loading" /> : <Icon type="unlock" />} />
      </AntDesignSteps>
    </ProgressContainer>
  )
}

export default Steps;
