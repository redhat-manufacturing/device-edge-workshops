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
  DescriptionList, DescriptionListTerm, DescriptionListGroup, DescriptionListDescription, CardTitle
} from '@patternfly/react-core';

import AnisbleIcon from '@patternfly/react-icons/dist/esm/icons/ansible-tower-icon';
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import './App.css'

var pg = require('pg')
var connectionString = "postgres://attendance:attendance@attendance/localhost:15432/attendance";
var pgClient = new pg.Client(connectionString)
pgClient.connect(); 


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
      <Flex className="Overview-container" direction={{ default: "columnn" }}>
        <div className='Overview-top-spacing'></div>
        <Box>
          <Title headingLevel='h1' size={TitleSizes['4xl']}>General Information</Title>
          <Card isCompact isRounded className='Overview-card' alignSelf={{ default: 'alignSelfCenter' }}>
            <DescriptionList  isVertical columnModifier={{ lg: '2Col' }} termWidth="10ch">
              <Card component="div">
                <CardTitle>AWS kickstart info</CardTitle>
                <CardBody>
                  <DescriptionListTerm className='Description-list'>IP Address:</DescriptionListTerm>
                  <DescriptionListDescription className >*insert varaible here with link to the resource*</DescriptionListDescription>
                  <DescriptionListTerm className='Description-list'>DNS Hostname:</DescriptionListTerm>
                  <DescriptionListDescription className >*insert varaible here with link to the resource*</DescriptionListDescription>
                </CardBody>
              </Card>
              <Card component="div">
                <CardTitle>Local kickstart info</CardTitle>
                <CardBody>
                  <DescriptionListTerm className='Description-list'>IP Address:</DescriptionListTerm>
                  <DescriptionListDescription className >*insert varaible here with link to the resource*</DescriptionListDescription>
                  <DescriptionListTerm className='Description-list'>DNS Hostname:</DescriptionListTerm>
                  <DescriptionListDescription className >*insert varaible here with link to the resource*</DescriptionListDescription>
                </CardBody>
              </Card>
            </DescriptionList>
          </Card>
          
        </Box>
        <Box className='box'>
          <Title headingLevel='h1' size={TitleSizes['4xl']}>AWS Resources</Title>
          <Card isCompact isRounded className='Overview-card' alignSelf={{ default: 'alignSelfCenter' }}>
            <DescriptionList displaySize="sm"  columnModifier={{ sm: '2Col' }}>
              <Card component='div' className='Description-card'>
                <DescriptionListGroup>
                  <DescriptionListTerm >SourceControl/Gitea:</DescriptionListTerm>
                  <DescriptionListTerm className='Description-list'>WebUI Link:</DescriptionListTerm>
                  <DescriptionListDescription className >*insert varaible here with link to the resource*</DescriptionListDescription>
                  <DescriptionListTerm className='Description-list'>Username:</DescriptionListTerm>
                  <DescriptionListDescription className >*insert varaible here with link to the resource*</DescriptionListDescription>
                  <DescriptionListTerm className='Description-list'>Password:</DescriptionListTerm>
                  <DescriptionListDescription className >*insert varaible here with link to the resource*</DescriptionListDescription>
                </DescriptionListGroup>
              </Card>
              <Card component='div' className='Description-card'>
                <DescriptionListGroup>
                  <DescriptionListTerm >Image Builder Access:</DescriptionListTerm>
                  <DescriptionListTerm className='Description-list'>WebUI Link:</DescriptionListTerm>
                  <DescriptionListDescription className >*insert varaible here with link to the resource*</DescriptionListDescription>
                  <DescriptionListTerm className='Description-list'>Username:</DescriptionListTerm>
                  <DescriptionListDescription className >*insert varaible here with link to the resource*</DescriptionListDescription>
                  <DescriptionListTerm className='Description-list'>Password:</DescriptionListTerm>
                  <DescriptionListDescription className >*insert varaible here with link to the resource*</DescriptionListDescription>
                </DescriptionListGroup>
              </Card>
              <Card component='div' className='Description-card'>
                <DescriptionListGroup>
                  <DescriptionListTerm >Ansible Controller Access:</DescriptionListTerm>
                  <DescriptionListTerm className='Description-list'>WebUI Link:</DescriptionListTerm>
                  <DescriptionListDescription className >*insert varaible here with link to the resource*</DescriptionListDescription>
                  <DescriptionListTerm className='Description-list'>Username:</DescriptionListTerm>
                  <DescriptionListDescription className >*insert varaible here with link to the resource*</DescriptionListDescription>
                  <DescriptionListTerm className='Description-list'>Password:</DescriptionListTerm>
                  <DescriptionListDescription className >*insert varaible here with link to the resource*</DescriptionListDescription>
                </DescriptionListGroup>
              </Card>
              <Card component='div' className='Description-card'>
                <DescriptionListGroup>
                  <DescriptionListTerm >Edge Manager SSH Access:</DescriptionListTerm>
                  <DescriptionListTerm className='Description-list'>Hostname:</DescriptionListTerm>
                  <DescriptionListDescription className >*insert varaible here with link to the resource*</DescriptionListDescription>
                  <DescriptionListTerm className='Description-list'>Username:</DescriptionListTerm>
                  <DescriptionListDescription className >*insert varaible here with link to the resource*</DescriptionListDescription>
                  <DescriptionListTerm className='Description-list'>Password:</DescriptionListTerm>
                  <DescriptionListDescription className ><a>edge-manager.testing.sandbox1223.opentlc.com</a></DescriptionListDescription>
                </DescriptionListGroup>
              </Card>
              
            </DescriptionList>
          </Card>
        </Box>
        <Box className='box'>
          <Title headingLevel='h1' size={TitleSizes['4xl']}>Local Resources</Title>
          <Card isCompact isRounded className='Overview-card' alignSelf={{ default: 'alignSelfCenter' }}>
            <DescriptionList displaySize="sm"  columnModifier={{ sm: '2Col' }}>
              <Card component='div' className='Description-card'>
                <DescriptionListGroup>
                  <DescriptionListTerm >SourceControl/Gitea:</DescriptionListTerm>
                  <DescriptionListTerm className='Description-list'>WebUI Link:</DescriptionListTerm>
                  <DescriptionListDescription className >*insert varaible here with link to the resource*</DescriptionListDescription>
                  <DescriptionListTerm className='Description-list'>Username:</DescriptionListTerm>
                  <DescriptionListDescription className >*insert varaible here with link to the resource*</DescriptionListDescription>
                  <DescriptionListTerm className='Description-list'>Password:</DescriptionListTerm>
                  <DescriptionListDescription className >*insert varaible here with link to the resource*</DescriptionListDescription>
                </DescriptionListGroup>
              </Card>
              <Card component='div' className='Description-card'>
                <DescriptionListGroup>
                  <DescriptionListTerm >Image Builder Access:</DescriptionListTerm>
                  <DescriptionListTerm className='Description-list'>WebUI Link:</DescriptionListTerm>
                  <DescriptionListDescription className >*insert varaible here with link to the resource*</DescriptionListDescription>
                  <DescriptionListTerm className='Description-list'>Username:</DescriptionListTerm>
                  <DescriptionListDescription className >*insert varaible here with link to the resource*</DescriptionListDescription>
                  <DescriptionListTerm className='Description-list'>Password:</DescriptionListTerm>
                  <DescriptionListDescription className >*insert varaible here with link to the resource*</DescriptionListDescription>
                </DescriptionListGroup>
              </Card>
              <Card component='div' className='Description-card'>
                <DescriptionListGroup>
                  <DescriptionListTerm >Ansible Controller Access:</DescriptionListTerm>
                  <DescriptionListTerm className='Description-list'>WebUI Link:</DescriptionListTerm>
                  <DescriptionListDescription className >*insert varaible here with link to the resource*</DescriptionListDescription>
                  <DescriptionListTerm className='Description-list'>Username:</DescriptionListTerm>
                  <DescriptionListDescription className >*insert varaible here with link to the resource*</DescriptionListDescription>
                  <DescriptionListTerm className='Description-list'>Password:</DescriptionListTerm>
                  <DescriptionListDescription className >*insert varaible here with link to the resource*</DescriptionListDescription>
                </DescriptionListGroup>
              </Card>
              
              
            </DescriptionList>
          </Card>
        </Box>

      </Flex >
    );
  }
}

export default Overview; 
