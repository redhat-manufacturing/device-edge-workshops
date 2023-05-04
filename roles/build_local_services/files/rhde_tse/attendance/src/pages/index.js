import React from "react";
import { BackgroundImage, Divider, LoginForm, LoginPage, StackItem } from "@patternfly/react-core";
import { Link } from 'react-router-dom';

import {
  Bullseye,
  Stack,
  Title,
  Button,
  TitleSizes,
  Flex,
} from '@patternfly/react-core';
import AnisbleIcon from '@patternfly/react-icons/dist/esm/icons/ansible-tower-icon';
import Background from '../images/pfbg_1200.jpg';
import RedHat from '../images/Logo-Red_Hat-B-Reverse-RGB.png'






const Homepage = () => {
  return (
    <div>
      <BackgroundImage src={Background} />
      <Stack>
        <Flex className='Flex-options'>
          <Stack className='Stack-options'>
            <StackItem className='Stack-options'>
              <img src={RedHat} className="image"></img>
            </StackItem>
            <StackItem className='Stack-options'>
              <h1 className='h1'>Welcome to the Red Hat Device Edge Workshop</h1> 
            </StackItem>
            <StackItem className='Stack-options'>
            <h2 className='h2'>Please click the button correspoding to your student number below</h2>
            </StackItem>
            <StackItem is filled>
              <Link className='button' to="/Student"><Button >Student</Button></Link> 
              <Link className='button' to="/Student"><Button>Student</Button></Link>
              <Link className='button' to="/Student"><Button>Student</Button></Link>
              <Link className='button' to="/Student"><Button>Student</Button></Link>
              <Link className='button' to="/Student"><Button>Student</Button></Link>
              <Link className='button' to="/Student"><Button>Student</Button></Link>
              <Link className='button' to="/Student"><Button>Student</Button></Link>
            </StackItem>
          </Stack>
        </Flex>
      </Stack>

    </div>
  );
};

export default Homepage;

