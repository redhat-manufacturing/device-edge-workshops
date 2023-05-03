import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardTitle,
    Gallery,
    GalleryItem,
    Level,
    LevelItem,
    Flex,
    FlexItem
} from '@patternfly/react-core';

import GithubIcon from '@patternfly/react-icons/dist/esm/icons/github-icon';

import AnisbleIcon from '@patternfly/react-icons/dist/esm/icons/ansible-tower-icon';

export default function Collections() {
    return (
        <Flex className="Gallery-options" direction={{default: "column"}} align={{ default: "alignLeft"}} flexWrap={{default: "wrap"}} spaceItems={{default: "spaceItems2xl"}}>  
        
            <Flex className="Gallery-options-two" spaceItems={{default: "spaceItems2xl"}}>
            <Card isRounded isLarge className="Collections-card"> 
                <CardTitle> Infinispan / Red Hat Data Grid </CardTitle>
                <CardBody> Tab 1 Card Body</CardBody>
                <CardFooter><Button className="Button-color" variant="link" icon={<GithubIcon size="lg" className="Icon-color"/>} component="a" href="https://github.com/ansible-middleware/infinispan" target="_blank" hasGutter></Button></CardFooter>
            </Card>
            
            <Card isRounded isLarge className="Collections-card">
                <CardTitle> Keycloak / Red Hat Single Sign-On </CardTitle>
                <CardBody> Tab 1 Card Body</CardBody>
                <CardFooter><Button className="Button-color" variant="link" icon={<GithubIcon size="lg" className="Icon-color"/>} component="a" href="https://github.com/ansible-middleware/keycloak" target="_blank" hasGutter></Button></CardFooter>
            </Card>
            </Flex>
            <Flex className="Gallery-options-two" spaceItems={{default: "spaceItems2xl"}}>
            <Card isRounded isLarge className="Collections-card">
                <CardTitle> Wildfly / Red Hat JBoss EAP </CardTitle>
                <CardBody> Tab 1 Card Body</CardBody>
                <CardFooter><Button className="Button-color" variant="link" icon={<GithubIcon size="lg" className="Icon-color"/>} component="a" href="https://github.com/ansible-middleware/wildfly" target="_blank" hasGutter></Button></CardFooter>
            </Card>
            
            <Card isRounded isLarge className="Collections-card">
                <CardTitle> Tomcat / Red Hat JWS </CardTitle>
                <CardBody> Tab 1 Card Body</CardBody>
                <CardFooter><Button className="Button-color" variant="link" icon={<GithubIcon size="lg" className="Icon-color"/>} component="a" href="https://github.com/ansible-middleware/jws" target="_blank" hasGutter></Button></CardFooter>
            </Card>
            </Flex>
            <Flex className="Gallery-options-two" spaceItems={{default: "spaceItems2xl"}}>
            <Card isRounded isLarge className="Collections-card">
                <CardTitle> ActiveMQ / Red Hat AMQ Broker </CardTitle>
                <CardBody> Tab 1 Card Body</CardBody>
                <CardFooter><Button className="Button-color" variant="link" icon={<GithubIcon size="lg" className="Icon-color"/>} component="a" href="https://github.com/ansible-middleware/amq" target="_blank" hasGutter></Button></CardFooter>
            </Card>
            
            <Card isRounded isLarge className="Collections-card">
                <CardTitle> Kafka / Red Hat AMQ Streams </CardTitle>
                <CardBody> Tab 1 Card Body</CardBody>
                <CardFooter><Button className="Button-color" variant="link" icon={<GithubIcon size="lg" className="Icon-color"/>} component="a" href="https://github.com/ansible-middleware/amq_streams" target="_blank" hasGutter></Button></CardFooter>
            </Card>
            </Flex>
            <Flex className="Gallery-options-two" spaceItems={{default: "spaceItems2xl"}}>           
            <Card isRounded isLarge className="Collections-card">
                <CardTitle> Red Hat CSP Download </CardTitle>
                <CardBody> Tab 1 Card Body</CardBody>
                <CardFooter><Button className="Button-color" variant="link" icon={<GithubIcon size="lg" className="Icon-color"/>} component="a" href="https://github.com/ansible-middleware/redhat-csp-download" target="_blank" hasGutter></Button></CardFooter>
            </Card>
            
            
            <Card isRounded isLarge className="Collections-card">
                <CardTitle> JCliff </CardTitle>
                <CardBody> Tab 1 Card Body</CardBody>
                <CardFooter><Button className="Button-color" variant="link" icon={<GithubIcon size="lg" className="Icon-color"/>} component="a" href="https://github.com/ansible-middleware/ansible_collections_jcliff" target="_blank" hasGutter></Button></CardFooter> 
            </Card>
            </Flex>
            
        </Flex>
        
    );
}
