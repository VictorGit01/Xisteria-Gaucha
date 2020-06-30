import React from 'react'
import styled from 'styled-components/native'

const Section = styled.SafeAreaView`   
    justify-content: center;
    align-items: center;
    padding-horizontal: 15px;
`
// height: 50px;
// width: 92%;
// border-bottom-width: .5px
// border-top-color: #000;
// background-color: transparent
// align-self: center;

const SectionArea = styled.View`
    width: 100%;
    height: 56px;
    justify-content: center;
    align-items: flex-start;
    border-bottom-width: .5px;
`
//#38761d
//#075715
//43px
//border-bottom-width: .5px
//border-top-width: .5px
//padding-horizontal: 10px;

const Title = styled.Text`
    font-size: 20px;
    color: #000;
`
//margin-left: -6;

export default (props) => (
    <Section>
        <SectionArea>
            <Title> {props.title} </Title>
        </SectionArea>
    </Section>
)