import React from 'react';

import {
  Bullseye,
  Button,
  Card,
  CardBody,
  Flex,
  FlexItem,
  Stack,
  StackItem,
  Tab,
  Tabs,
  Title,
  TitleSizes,
  DescriptionList, DescriptionListTerm, DescriptionListGroup, DescriptionListDescription, CardTitle, BackgroundImage
} from '@patternfly/react-core';

import AnisbleIcon from '@patternfly/react-icons/dist/esm/icons/ansible-tower-icon';
import Background from './images/pfbg_1200.jpg';
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import './App.css'
import RedHat from './images/Logo-Red_Hat-B-Reverse-RGB.png'


const boxVariant = {
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  hidden: { opacity: 0, scale: 0 }
};

// The individual item that appears on scroll
const Box = ({ children }) => {

  const control = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      control.start("visible");
    } else {
      control.start("hidden");
    }
  }, [control, inView]);

  return (
    <motion.div
      className="box"
      ref={ref}
      variants={boxVariant}
      initial="hidden"
      animate={control}
    >
      <FlexItem>
        {children}
      </FlexItem>
    </motion.div>
  );
};

class Overview extends React.Component {
  constructor(props) {
    super(props);
    this.handleButtonClick.bind(this);
  }

  // when we click a button in the last box change the tab we're on in the parent
  handleButtonClick = (event, tabIndex) => {
    this.props.handleTabClick(event, tabIndex);
  }

  // content refs for the collectoins and documentation tabs from app.js
  contentRef3 = this.props.contentRef3;
  contentRef5 = this.props.contentRef5;

  render() {
    return (
      <div>
        <BackgroundImage src={Background} />

        <Flex className="Overview-container" direction={{ default: "columnn" }}>
          <div className='Overview-top-spacing'></div>

          <Box>
            <Title headingLevel='h1' size={TitleSizes['4xl']}>General Information</Title>
            <Card isCompact isRounded className='Overview-card' alignSelf={{ default: 'alignSelfCenter' }}>
              <DescriptionList isVertical columnModifier={{ lg: '2Col' }} termWidth="10ch">
                <Card component="div">
                  <CardTitle>Anisble Controller</CardTitle>
                  <CardBody>
                    <DescriptionListTerm className='Description-list'>Username:</DescriptionListTerm>
                    <DescriptionListDescription className >*Username here*</DescriptionListDescription>
                    <DescriptionListTerm className='Description-list'>Password:</DescriptionListTerm>
                    <DescriptionListDescription className >*Password here*</DescriptionListDescription>
                    <DescriptionListTerm className='Description-list'>IP Address:</DescriptionListTerm>
                    <DescriptionListDescription className ><a href="https://google.com">*insert varaible here with link to the resource*</a></DescriptionListDescription>
                    <DescriptionListTerm className='Description-list'>DNS Hostname:</DescriptionListTerm>
                    <DescriptionListDescription className ><a href="https://google.com">*insert varaible here with link to the resource*</a></DescriptionListDescription>
                  </CardBody>
                </Card>
                <Card component="div">
                  <CardTitle>Gitea (Source Control)</CardTitle>
                  <CardBody>
                    <DescriptionListTerm className='Description-list'>Username:</DescriptionListTerm>
                    <DescriptionListDescription className >*Username here*</DescriptionListDescription>
                    <DescriptionListTerm className='Description-list'>Password:</DescriptionListTerm>
                    <DescriptionListDescription className >*Password here*</DescriptionListDescription>
                    <DescriptionListTerm className='Description-list'>IP Address:</DescriptionListTerm>
                    <DescriptionListDescription className ><a href="https://google.com">*insert varaible here with link to the resource*</a></DescriptionListDescription>
                    <DescriptionListTerm className='Description-list'>DNS Hostname:</DescriptionListTerm>
                    <DescriptionListDescription className ><a href="https://google.com">*insert varaible here with link to the resource*</a></DescriptionListDescription>
                  </CardBody>
                </Card>
                <Card component="div">
                  <CardTitle>Image Builder</CardTitle>
                  <CardBody>
                    <DescriptionListTerm className='Description-list'>Username:</DescriptionListTerm>
                    <DescriptionListDescription className >*Username here*</DescriptionListDescription>
                    <DescriptionListTerm className='Description-list'>Password:</DescriptionListTerm>
                    <DescriptionListDescription className >*Password here*</DescriptionListDescription>
                    <DescriptionListTerm className='Description-list'>IP Address:</DescriptionListTerm>
                    <DescriptionListDescription className ><a href="https://google.com">*insert varaible here with link to the resource*</a></DescriptionListDescription>
                    <DescriptionListTerm className='Description-list'>DNS Hostname:</DescriptionListTerm>
                    <DescriptionListDescription className ><a href="https://google.com">*insert varaible here with link to the resource*</a></DescriptionListDescription>
                  </CardBody>
                </Card>
                <Card component="div">
                  <CardTitle>Wifi Information</CardTitle>
                  <CardBody>
                    <DescriptionListTerm className='Description-list'>Netowrk Name:</DescriptionListTerm>
                    <DescriptionListDescription className >*Network name here*</DescriptionListDescription>
                    <DescriptionListTerm className='Description-list'>Password:</DescriptionListTerm>
                    <DescriptionListDescription className >*Password here*</DescriptionListDescription>
                  </CardBody>
                </Card>
              </DescriptionList>
            </Card>
          </Box>
        </Flex >
      </div>
    );
  }
}

export default Overview; 
