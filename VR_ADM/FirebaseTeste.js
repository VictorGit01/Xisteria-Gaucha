import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import firebase from './firebase'
import './src/fixtimerbug'

const Page = styled.SafeAreaView`
  flex: 1;
  padding: 20px;
`

const Text = styled.Text``

const Input = styled.TextInput`
  height: 40px;
  border: 1px solid #f00;
`

const Button = styled.Button``

export default () => {
  const [ nameInput, setNameInput ] = useState('')
  const [ ageInput, setAgeInput ] = useState('')

  useEffect(() => {
    // firebase.database().ref('contagem').set('90')
    /*
    firebase.database().ref('usuarios').child('2').set({
      idade: 26
    })
    */
    // firebase.database().ref('usuarios').child('2').child('idade').set(26)

    // firebase.database().ref('usuarios').child(id).child('nome').set('Paulino')

    /*
    firebase.database().ref('usuarios').child('1').set({
      nome: 'Nelson Victor',
      idade: 91
    })
    */

    // firebase.database().ref('usuarios').child(id).remove()

    firebase.database().ref('contagem').remove()
  }, [])

  const insertUser = () => {
    if (nameInput.length > 0) {

      let users = firebase.database().ref('usuarios')

      let key = users.push().key

      users.child(key).set({
        nome: nameInput,
        idade: ageInput,
      })

    } else {
      alert('Usuário inserido!')
    }
  }

  return (
    <Page>
      <Text>Nome do usuário:</Text>
      <Input onChangeText={(name) => setNameInput(name)} />
      <Text>Idade do usuário:</Text>
      <Input onChangeText={(age) => setAgeInput(age)} />
      <Button title='Inserir Usuário' onPress={insertUser} />
    </Page>
  )
}