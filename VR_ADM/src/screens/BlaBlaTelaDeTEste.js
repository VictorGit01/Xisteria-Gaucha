import React, { useEffect } from 'react'

useEffect(() => {
    firebase.database().ref('category').on('value', (snapshot) => {
        // console.log(snapshot.val())
        let newList = []
        // let idList = []
        snapshot.forEach((childItem) => {
            // console.log(childItem.toJSON())


            /*
            let title = childItem.key.toString()
            idList.push({
                title: title,
                data: []
            })
            */


            // console.log(childItem.key)
            // console.log(idList)
            // console.log(childItem)
            
            // console.log(idList[p])
            // setIdList(idList)
            // setList(idList)
            childItem.forEach((item) => {
                // objectList = Object.assign(item, idList[p].title)
                // console.log(objectList)
                // let outro = Object.assign(item)
                // item.child('price')
                // let nome = {nome: 'Paulo'}
                // let preco = {it: item}
                // preco.nome = nome
                // nome.preco = preco.it
                // nome.outro = item.child('price')
                // objectList = Object.assign(outro, nome[0])
                // console.log(nome.preco.description)
                // console.log(item.child('name'))
                let nameJson = item.child('name').toJSON().toString()
                let descJson = item.child('description').toJSON().toString()
                let priceJson = item.child('price').toJSON().toString()
                /*
                let name = nameJson.toString()
                let desc = descJson.toString()
                let price = priceJson.toString()
                */


                // Reseta a lista data depois de listar os items
                // idList[p].data = []




                /*
                idList[p].data.push({
                    id: item.key,
                    name: nameJson,
                    description: descJson,
                    price: priceJson,
                })
                */



                // setIdList(idList)
                // console.log(idList[p].data)
                // console.log(item)
                // idList[p].
                /*
                data: [
                    {id: item.key}
                ]
                */
                // console.log(idList)
                // console.log(idList)
            })
            setTitle(childItem.key)
            newList.push({
                title: childItem.key,
                data: data
                /*
                data: data.push({
                    name: childItem.val().
                })
                */
                //data: [childItem.val().key]
            })
            // p = p + 1
            // console.log(p)
            // console.log(list)
        })
        setMenuList(newList)
        // setList(idList)
        // console.log(list)
        // console.log(idList[1].data)
    })
    
    // console.log(idList[0])
})