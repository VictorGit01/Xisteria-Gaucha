import React, { useEffect, useState, useContext } from 'react'
import { connect } from 'react-redux'
import { Dimensions } from 'react-native'
import { normalize } from '../functions'
import styled from 'styled-components/native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import firebase from '../../firebase'
import NetInfo from '@react-native-community/netinfo'

// Components:
import LoadingPage from '../components/LoadingPage';
import ListItem from '../components/InfoCategory/ListItem';
import NoConnection from '../components/NoConnection';

// Contexts:
import CallHistoryContext from '../contexts/CallHistoryContext'

const { height, width } = Dimensions.get('window')

// function normalize(size) {
//     return (width + height) / size
// }

const Page = styled.SafeAreaView`
    flex: 1;
    height: ${height}px;
    justify-content: center;
    align-items: center;
    background-color: #b9f7bf;
`

const Listing = styled.FlatList`
    width: 100%;
`

// const OverlayContainer = styled.View`
//     height: 100%
//     width: 100%
//     flex-direction: row;
//     justify-content: center;
//     align-items: center;
//     background-color: rgba(255, 255, 255, .4);
//     position: absolute
//     zIndex: 3;
// `

// const Item = styled.TouchableHighlight`
//     justify-content: center;
//     align-items: center;
//     border-bottom-width: .5px;
// `
// // padding-horizontal: 15px;

// const ItemArea = styled.View`
//     width: 100%;
//     flex-direction: row;
//     align-items: center;
    
//     border-color: #000;
//     padding: ${normalize(120)}px 15px;
    
// `

// const ItemImage = styled.Image`
//     height: ${normalize(16)}px;
//     width: ${normalize(13)}px;
//     border-radius: 5px;
//     resize-mode: cover;
//     margin-left: 5px;
// `

// const ItemText = styled.Text`
//     font-size: ${props => props.size || normalize(72)}px;
//     color: ${props => props.color || '#ff2626'};
// `
// // margin-horizontal: ${normalize(110)}px;

// const LeftArea = styled.View`
//     flex: 1;
//     justify-content: space-between;
// `

// const RightArea = styled.View`
//     flex: 1.8;
//     flex-direction: row;
//     justify-content: space-between;
//     align-items: center;
// `
// // justify-content: flex-start;

// const Title = styled.Text`
//     font-size: 18px;
// `

const Screen = (props) => {
    const [ loading, setLoading ] = useState(true)
    const [ noConnection, setNoConnection ] = useState(false)
    const [ callNetInfo, setCallNetInfo ] = useState(false)
    const [ list, setList ] = useState(null)
    const [ images, setImages ] = useState([])
    const [ idsImg, setIdsImg ] = useState(null)
    const [ loadVisible, setLoadVisible ] = useState(true)
    const [ callHistory, setCallHistory ] = useContext(CallHistoryContext)

    const posts = firebase.database().ref('posts')
    const posts_img = firebase.storage().ref().child('posts')
    // const cityId = 'U56Sf1atD5TKSCJzxsKsvIDDlTr2'

    let { navigation, cityId } = props
    let params = navigation.state.params
    let nav = navigation.navigate

    useEffect(() => {
        setLoading(true)

        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                setNoConnection(true)
                endOfLoading()
            } else {
                setNoConnection(false)
                getCategory()
            }
        })
    }, [callNetInfo])

    function endOfLoading() {
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }

    async function getCategory() {
        let isCancelled = false

        await posts.child(cityId).child(params.id).child('data').on('value', snapshot => {
            try {
                if (!isCancelled) {
                    let newList = []
                    let newIdsImg = []
                    let newImages = []
                    snapshot.forEach((childItem) => {
                        newList.push(childItem.val())
                        // if (childItem.val().image) {
                        //     // newIdsImg.push(childItem.val().id)
                        //     // console.log('Imagem exist')
                        //     posts_img.child(cityId).child(`${childItem.val().id}.jpg`).getDownloadURL().then((url) => {
                        //         const source = { uri: url }
            
                        //         // setImages([...newImages, source ])
                        //         newImages.push({
                        //             source
                        //         })
                        //         // console.log(newImages)
                        //         // return source
                        //     })
                        // }
                    })

                    // console.log(newImages)

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
                    endOfLoading()
                    // setIdsImg(newIdsImg)
                    // let newImages = Array.from(images)
                    // let newImages = newIdsImg.every(item => {
                    //     posts_img.child(cityId).child(`${item}.jpg`).getDownloadURL().then((url) => {
                    //         const source = { uri: url }
        
                    //         // setImages([...newImages, source ])
                    //         // newImages.push({
                    //         //     source
                    //         // })
                    //         // console.log(newImages)
                    //         return source
                    //     })
                    // })
                    // // setImages(newImages)
                    // console.log(newImages)

                }
            } catch(e) {
                if (!isCancelled) {
                    console.log(e)
                }
            }
        })

        return () => {
            isCancelled = true
        }
    }

    // useEffect(() => {
    //     // posts.child(cityId).child(params.id).child('data').on('value', snapshot => {
    //     //     let newImages = []
    //     //     snapshot.forEach(childItem => {
    //     //         if (childItem.val().image) {
    //     //             newImages.push()
    //     //         }
    //     //     })
    //     // })
    //     // posts_img.child(cityId)
    //     if (idsImg) {
    //         console.log('Chamando image')
    //         let newImages = []
    //         idsImg.forEach(item => {
    //             posts_img.child(cityId).child(`${item}.jpg`).getDownloadURL().then((url) => {
    //                 const source = { uri: url }

    //                 newImages.push(source)
    //             })
    //         })
    //         setImages(newImages)
    //         // console.log(newImages)
    //     }
        
    // }, [])

    // useEffect(() => {
    //     console.log(images)
    // }, [images])
    
    function renderItem({ item }) {
        // let price = Number(item.price)

        // return (
        //     <Item
        //         onPress={() => nav('InfoSnack', { name: item.name, data: item, sectionId: params.id, sectionIndex: params.index })}
        //         underlayColor='rgba(0, 0, 0, .03)'
        //         disabled={!item.publish}
        //     >
        //         <>
        //             <ItemArea>
        //                 <LeftArea>
        //                     <ItemText style={{ marginVertical: 5 }} >{item.name}</ItemText>
        //                     <ItemText style={{ marginVertical: 5 }} color='#000' >R$ {price.toFixed(2).replace('.', ',')}</ItemText>
        //                 </LeftArea>
        //                 <RightArea>
        //                     <ItemText color='#999' numberOfLines={2} >{item.description}</ItemText>
        //                 </RightArea>
        //                 {images && images.length > 0 && <ItemImage source={images[0]} />}
        //                 <Icon name='keyboard-arrow-right' size={normalize(57)} color='#999' />
        //             </ItemArea>
        //             {!item.publish && <OverlayContainer>
        //                 <Icon name='not-interested' size={20} color='#ff2626' />
        //                 <ItemText style={{ fontSize: 18, marginLeft: 10 }} >Produto Indisponível</ItemText>
        //             </OverlayContainer>}
        //         </>
        //     </Item>
        // )
    }

    if (loading) {
        return <LoadingPage />
    } else if (noConnection) {
        return (
            <Page style={{ justifyContent: 'center' }} >
                <NoConnection onPress={() => setCallNetInfo(!callNetInfo)} />
            </Page>
        )
    }

    return (
        <Page>
            <Listing
                data={list}
                // renderItem={renderItem}
                renderItem={({ item }) => <ListItem item={item} navigation={navigation} cityId={cityId} />}
                keyExtractor={item => item.id}
            />
        </Page>
    )
}

Screen.navigationOptions = ({ navigation }) => {
    let params = navigation.state.params

    return {
        headerTitle: params.title
    }
}

const mapStateToProps = (state) => {
    return {
        cityId: state.userReducer.cityId
    }
}

export default connect(mapStateToProps)(Screen)