import React, { useEffect, useState, useContext } from 'react'
import styled from 'styled-components/native'
import FontIcon from 'react-native-vector-icons/FontAwesome5'
import firebase from '../../../firebase'

// Components:
import ModalQuesBox from './Item/ModalItemQues'
import ModalDelete from './Item/ModalItemDel'

// Contexts:
import LoaderContext from '../../contexts/LoaderContext'

const Area = styled.View`
    height: auto
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    border: 1px solid #999;
    border-top-width: 0px;
    padding: 20px 10px 20px 15px;
`
// padding: 15px 10px;
// padding: 20px 15px;

const LeftArea = styled.View`
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    right: 5px;
`
// flex: 1
// width: 45%;

const RightArea = styled.View`
    width: 45%;
    flex-direction: row;
    justify-content: flex-end;
    justify-content: space-between;
    align-items: center;
`
// flex: 1
// width: 65%

const Text = styled.Text`
    font-size: 16px;
    color: ${props => props.color || '#606060'};
    text-decoration: ${props => props.decoration || 'none'};
`

const ButtonEdit = styled.TouchableOpacity`
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-left: 20px;
`

const QuestionBox = styled.View`
    height: 100px;
    width: 200px;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    position: absolute;
    top: 30px;
    right: 30px;
`

const BoxButton = styled.TouchableHighlight`
    height: 40px;
    width: 100%;
    background-color: #ddd;
`

export default (props) => {
    const [ quesVisible, setQuesVisible ] = useState(false)
    const [ deleteVisible, setDeleteVisible ] = useState(false)
    const [ publish, setPublish ] = useState(false)
    const [ loaderVisible, setLoaderVisible ] = useContext(LoaderContext)
    const [ dataCopy, setDataCopy ] = useState({})

    let { nav, section, data } = props
    // let params = navigation.state.params
    let price = Number(data.price)
    const posts = firebase.database().ref('posts')
    // let dataCopy = posts.child(section.id).child('data').child(data.id)
    const cityId = firebase.auth().currentUser.uid

    useEffect(() => {
        // console.log('------------DATA------------')
        // console.log(section.data)
    })    

    useEffect(() => {
        posts.child(cityId).child(section.id).child('data').child(data.id).on('value', snapshot => {
            if (snapshot.val()) {
                setDataCopy(snapshot.val())
                // setPublish(dataCopy.publish)
            }
        })
    }, [])

    // const publishDB = () => {
    //     posts.child(section.id).child('data').child(data.id).child('publish').set(publish)
    // }

    // const handlePublish = () => {
    //     // setPublish(!publish)
    //     // publishDB()
    //     posts.child(section.id).child('data').child(data.id).on('value', snapshot => {
    //         if (snapshot.val()) {
    //             posts.child(section.id).child('data').child(data.id).child('publish').set(snapshot.val().publish ? false : true)
    //         }
    //     })
    // }

    // useEffect(() => {
        
    // }, [handlePublish])

    const handlePublish = () => {
        setLoaderVisible(true)
        setTimeout(() => {
            // setPublish(!publish)
            dataCopy.publish = !dataCopy.publish
            setDataCopy(dataCopy)
            // posts.child(section.id).child('data').child(data.id).set(dataCopy)
            posts.child(cityId).child(section.id).child('data').child(data.id).child('publish').set(dataCopy.publish)
            .then(() => {
                setTimeout(() => {
                    setLoaderVisible(false)
                }, 500)
            })
            .catch(error => {
                setLoaderVisible(false)
                toastMsg(`${error.code} - ${error.message}`)
                console.log(error)
            })
        }, 1000)
    }
    

    return (
        // <Area key={props.index} >
        <Area>
            {data &&
            <LeftArea>
                {/* <Text style={{ width: data.image ? '80%' : '100%' }} > {data.name} </Text> */}
                <Text style={{ width: data.image ? '50%' : '60%' }} > {data.name} </Text>
                {data.image ? <FontIcon name='camera' size={20} color='#999' brand style={{ marginHorizontal: 5 }} /> : null}
                <Text>R$ {price.toFixed(2).replace('.', ',')}</Text>
            </LeftArea>}
            <RightArea>
                {/* <Text>R$ {price.toFixed(2).replace('.', ',')}</Text> */}
                <ButtonEdit
                    onPress={handlePublish}
                    activeOpacity={.7}
                    hitSlop={{ top: 15, bottom: 15 }}
                >
                    <FontIcon name={dataCopy.publish ? 'pause-circle' : 'play-circle'} size={20} color='#fe9601' />
                    <Text color='#fe9601' style={{ left: 5 }} >{dataCopy.publish ? 'Pausar' : 'Publicar'}</Text>
                </ButtonEdit>
                <ButtonEdit
                    onPress={() => setQuesVisible(true)}
                    activeOpacity={.7}
                    hitSlop={{ top: 15, bottom: 15, left: 30, right: 30 }}
                >
                    {/* <Text color='#ff2626' decoration='underline' >Editar</Text> */}
                    <FontIcon name='ellipsis-v' size={20} color='#fe9601' />
                </ButtonEdit>
            </RightArea>
            <ModalQuesBox
                modalVisible={quesVisible}
                setModalVisible={setQuesVisible}
                setDeleteVisible={setDeleteVisible}
                section={section}
                // dataId={data.id}
                data={data}
                nav={nav}
            />
            <ModalDelete
                modalVisible={deleteVisible}
                setModalVisible={setDeleteVisible}
                section={section}
                sectionId={section.id}
                dataIndex={props.index}
                dataId={data.id}
                dataImg={data.image}
                dataAddOns={data.add_ons}
            />
        </Area>
    )
}