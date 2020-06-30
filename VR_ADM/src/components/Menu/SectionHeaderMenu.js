import React, { useEffect, useState, useContext } from 'react'
import { ToastAndroid } from 'react-native'
import styled from 'styled-components/native'
import FontIcon from 'react-native-vector-icons/FontAwesome5'
import firebase from '../../../firebase'

// Components:
import ModalAdd from './ModalAdd_2'
import ModalQuesBox from './Section/ModalSectEdit'
import ModalDelete from './Section/ModalSecDelete'

// Components:
import LoaderContext from '../../contexts/LoaderContext'

const Area = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(0, 0, 0, .15)
    border: 1px solid #999
    border-bottom-width: 0px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    padding: 20px 10px 20px 15px;
`
// margin-top: 10px
// height: 50px;
// padding-horizontal: 15px
// padding-vertical: 20px;

const LeftArea = styled.View`
    flex: 1;
    justify-content: center;
`

const RightArea = styled.View`
    width: 45%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const Title = styled.Text`
    font-size: 18px;
`

const ButtonEdit = styled.TouchableOpacity`
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-left: 20px;
`
// height: 100%;
// width: auto

const TextSection = styled.Text`
    font-size: 16px;
    color: ${props => props.color || '#ff2626'};
    text-decoration: ${props => props.decoration || 'none'};
`
// margin-horizontal: 15px

export default (props) => {
    const [ modalVisible, setModalVisible ] = useState(false)
    const [ quesVisible, setQuesVisible ] = useState(false)
    const [ deleteVisible, setDeleteVisible ] = useState(false)
    const [ sectionCopy, setSectionCopy ] = useState({})
    const [ listPosts, setListPosts ] = useState(null)
    const [ publish, setPublish ] = useState(false)
    const [ loaderVisible, setLoaderVisible ] = useContext(LoaderContext)

    let { section } = props

    const posts = firebase.database().ref('posts')
    const cityId = firebase.auth().currentUser.uid

    useEffect(() => {
        // console.log(section)
        posts.child(cityId).child(section.id).on('value', snapshot => {
            if (snapshot.val()) {
                // setPublish(snapshot.val().publish)
                setSectionCopy(snapshot.val())
                // console.log(snapshot.val())
            }
        })
    }, [])

    const toastMsg = (msg) => {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            180,
        )
    }

    // function getTitles() {
    //     let newList = []
    //     let newListNotDup = []
    //     posts.on('value', snapshot => {
    //         snapshot.forEach(childItem => {
    //             // console.log(childItem.val().title)
    //             newList.push(childItem.val())
    //         })
    //     })
    //     setListPosts(newList)
    // }

    const handleEdit = () => {
        setQuesVisible(true)
        // getTitles()
        // console.log(props.section)
        // let newList = []
        // let newListNotDup = []
        // // posts.child(props.section.id).child('title').set
        // posts.on('value', snapshot => {
        //     snapshot.forEach(childItem => {
        //         // console.log(childItem.val().title)
        //         newList.push(childItem.val())
        //     })
        // })

        // let seen = {}
        // newListNotDup = newList.filter(function(entry) {
        //     let previous;
        //     if (seen.hasOwnProperty(entry.title)) {

        //         previous = seen[entry.id]

        //         // console.log(`Propriedade duplicada: ${entry.title}`)
        //         return false
        //     }

        //     seen[entry.id] = entry
        //     return true
        // })
    }

    // useEffect(() => {
    //     props.section.data.forEach((item) => {
    //         if (item.image) {
    //             console.log(item.id)
    //         }
    //     })
    // }, [])

    // useEffect(() => {
    //     posts.child(section.id).child('publish').set(publish)
    // }, [publish])
    
    const handlePublish = () => {
        if (section.data.length > 0) {
            setLoaderVisible(true)
            setTimeout(() => {
                // setPublish(!publish)
                sectionCopy.publish = !sectionCopy.publish
                setSectionCopy(sectionCopy)
                posts.child(cityId).child(section.id).child('publish').set(sectionCopy.publish)
                .then(() => {
                    setTimeout(() => {
                        setLoaderVisible(false)
                    }, 500)
                })
                .catch(error => {
                    setTimeout(() => {
                        setLoaderVisible(false)
                        toastMsg(`${error.code} - ${error.message}`)
                        console.log(error)
                    }, 500)
                })
            }, 1000)
        } else {
            toastMsg('Adicione itens à seção antes de publicá-la.')
        }
    }

    return (
        <Area>
            <LeftArea>
                <Title>{section.title}</Title>
            </LeftArea>
            <RightArea>
                <ButtonEdit
                    onPress={handlePublish}
                    activeOpacity={1}
                    hitSlop={{ top: 15, bottom: 15 }}
                >
                    <FontIcon name={sectionCopy.publish ? 'pause-circle' : 'play-circle'} size={20} color='#fe9601' />
                    <TextSection color='#fe9601' style={{ left: 5 }} >{sectionCopy.publish ? 'Pausar' : 'Publicar'}</TextSection>
                </ButtonEdit>
                <ButtonEdit hitSlop={{ top: 15, bottom: 15, left: 30, right: 30 }} activeOpacity={.7} onPress={handleEdit} >
                    {/* <TextSection decoration='underline' >Editar</TextSection> */}
                    <FontIcon name='ellipsis-v' size={20} color='#fe9601' />
                </ButtonEdit>
            </RightArea>
            <ModalQuesBox
                modalVisible={quesVisible}
                setModalVisible={setQuesVisible}
                setAddVisible={setModalVisible}
                setDeleteVisible={setDeleteVisible}
            />
            <ModalAdd
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                postId={section.id}
                section={section}
                editEnabled={true}
            />
            <ModalDelete
                modalVisible={deleteVisible}
                setModalVisible={setDeleteVisible}
                postId={section.id}
                section={section}
            />
        </Area>
    )
}