import React from "react";
import { Divider, LoginForm, LoginPage, StackItem } from "@patternfly/react-core";
import {
  Bullseye,
  Stack,
  Title,
  Button,
  TitleSizes
} from '@patternfly/react-core';
import AnisbleIcon from '@patternfly/react-icons/dist/esm/icons/ansible-tower-icon';

export default function Homepage() {
  const [showHelperText, setShowHelperText] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [isValidUsername, setIsValidUsername] = React.useState(true);
  const [password, setPassword] = React.useState('');
  const [isValidPassword, setIsValidPassword] = React.useState(true);
  const [isRememberMeChecked, setIsRememberMeChecked] = React.useState(false);
  const handleUsernameChange = value => {
    setUsername(value);
  };
  const handlePasswordChange = value => {
    setPassword(value);
  };
  const onRememberMeClick = () => {
    setIsRememberMeChecked(!isRememberMeChecked);
  };
  const onLoginButtonClick = event => {
    event.preventDefault();
    setIsValidUsername(!!username);
    setIsValidPassword(!!password);
    setShowHelperText(!username || !password);
  };
  
  return (
    <div>
    <AnisbleIcon size="lg" className="Icon-color"/>
    <LoginPage loginTitle="Ansible Device Edge Workshop" loginSubtitle="Enter your name and email below">
      <LoginForm usernameLabel="Name" usernameValue={username} onChangeUsername={handleUsernameChange} passwordLabel="Email" onChangePassword={handlePasswordChange} onLoginButtonClick={onLoginButtonClick} loginButtonLabel="Submit" />; 
      
    </LoginPage>
    </div> 
  );
}
