import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import firebase from '../../firebase';

// Components:
import LoadingPage from '../components/LoadingPage'
import FooterArea from '../components/Home/FooterArea'

const { height, width } = Dimensions.get('window');

function normalize(size) {
    return (width + height) / size;
}

const Page = styled.SafeAreaView`
    flex: 1;
    height: ${height}px;
    align-items: center;
    background-color: #b9f7bf;
`;

const Scroll = styled.ScrollView`
    width: 100%;
`;

const Top = styled.View`
    height: 40%;
    width: 100%;
    justify-content: center;
    align-items: center;
    background-color: rgb(245, 240, 230);
`;

const PostImage = styled.Image`
    height: 100%;
    width: 100%;
    resize-mode: cover;
`;

const Center = styled.View`
    height: 2%;
    width: 100%;
    background-color: #077a15;
`;

const Bottom = styled.View`
    height: 58%;
`;

const BottomItem = styled.View`
    height: ${height / 4.5}px;
    width: ${width / 2}px;
    padding: ${normalize(100)}px ${normalize(60)}px;
`;

const ButtonItem = styled.TouchableOpacity`
    
`

const BottomItemInner = styled.ImageBackground`
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
    background-color: #ddd;
    resize-mode: cover;
    border-radius: 5px;
`;
const Overlay = styled.View`
    flex: 1;
    width: 100%;
    justify-content: center;
    align-items: center;
    background-color: rgba(7, 122, 21, .2);
    border-radius: 5px;
`

const BottomItemCover = styled.View`
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, .5);
`

const TextTitle = styled.Text`
    font-size: 18px;
    font-style: italic;
    letter-spacing: 1.5px;
    color: #fff;
`

const Screen = (props) => {
    const [ list, setList ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ load, setLoad ] = useState(true)

    const posts = firebase.database().ref('posts')
    const { navigation, cityId, list_request, current_requests, setCurrentRequests } = props
    const nav = navigation.navigate
    // const cityId = 'U56Sf1atD5TKSCJzxsKsvIDDlTr2'

    useEffect(() => {
        let isCancelled = false
        // console.log(list_request)
        setLoading(true)

        list_request.map(item => {
            if (item.id == cityId) {
                setCurrentRequests(item.data)
            }
        })

        console.log('------------------LIST_REQUEST------------------')
        console.log(list_request)

        async function getPosts() {
            await posts.child(cityId).on('value', snapshot => {
                try {
                    if (!isCancelled) {
                        let newList = []
                        snapshot.forEach((childItem) => {
                            if (childItem.val().publish) {
                                newList.push(childItem.val())
                            }
                        })

                        let seen = {}
                        let newListNotDup = newList.filter(function(entry) {
                            let previous;
                            if (seen.hasOwnProperty(entry.id)) {

                                previous = seen[entry.id]
                                
                                return false
                            }

                            seen[entry.id] = entry

                            return true
                        })

                        setList(newListNotDup)

                        setTimeout(() => {
                            // setLoad(false)
                            setLoading(false)
                        }, 2000)
                    }
                } catch(e) {
                    if (!isCancelled) {
                        console.log(e)
                    }
                }
            })
        }

        getPosts()

        return () => {
            isCancelled = true
        }
    }, [cityId])

    return (
        <Page>
            <Top>
                <PostImage source={{ uri: 'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg' }} />
            </Top>
            <Center></Center>
            <Bottom>
                {!loading ?
                <>
                <Scroll
                    contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', paddingVertical: normalize(230) }}
                >
                    {list.map((item, index) => (
                        <BottomItem key={index} >
                            
                            <ButtonItem
                                onPress={() => nav('InfoCategory', { title: item.title, id: item.id, index: index })}
                                activeOpacity={.9}
                            >
                                <BottomItemInner borderRadius={5} source={{ uri: 'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg' }} >
                                <Overlay>
                                    <TextTitle>{item.title}</TextTitle>
                                </Overlay>
                                </BottomItemInner>
                            </ButtonItem>
                            
                        </BottomItem>
                    ))}
                </Scroll>
                <FooterArea nav={nav} />
                </> : <LoadingPage />}
            </Bottom>
        </Page>
    )
}

Screen.navigationOptions = ({ navigation }) => {
    const nav = navigation.navigate;

    const ButtonIcon = styled.TouchableOpacity`
        height: 100%;
        
        justify-content: center;
        align-items: center;
        padding-horizontal: 15px;
    `;
    // width: 60px;

    return {
        headerTitle: 'Xisteria Gaúcha',
        headerLeft: () => (
            <ButtonIcon
                onPress={() => nav('Information')}
            >
                <FontIcon name='info-circle' size={18} color='#fff' />
            </ButtonIcon>
        ),
        headerRight: () => (
            <>
                <ButtonIcon
                    onPress={() => nav('ChooseAddress', { resume: false })}
                    ativeOpacity={.7}
                    style={{ right: -2.5 }}
                >
                    <FontIcon name='map-marker-alt' size={18} color='#fff' />
                </ButtonIcon>
                <ButtonIcon
                    onPress={() => nav('History')}
                    activeOpacity={.7}
                    style={{ left: -2.5 }}
                >
                    <FontIcon name='history' size={18} color='#fff' />
                </ButtonIcon>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        cityId: state.userReducer.cityId,
        list_request: state.requestReducer.list_request,
        current_requests: state.requestReducer.current_requests
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setCurrentRequests: (current_requests) => dispatch({type: 'SET_CURRENT_REQUESTS', payload: {current_requests}})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Screen);