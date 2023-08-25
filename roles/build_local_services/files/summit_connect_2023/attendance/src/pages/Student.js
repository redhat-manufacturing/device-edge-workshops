import React from "react";
import { BackgroundImage, Divider, LoginForm, LoginPage, StackItem } from "@patternfly/react-core";
import { useHistory } from 'react-router-dom';
import {
    Bullseye,
    Stack,
    Title,
    Button,
    TitleSizes
} from '@patternfly/react-core';
import AnisbleIcon from '@patternfly/react-icons/dist/esm/icons/ansible-tower-icon';
import Background from '../images/pfbg_1200.jpg';






const Student = () => {
    return (
        <div>
            <BackgroundImage src={Background} />
            <Button>Hello #2</Button> 
        </div>
    );
}

export default Student;