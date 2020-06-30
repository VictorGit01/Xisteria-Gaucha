import uuid from 'uuid/v4'

//Suco de acerola:
//https://www.receiteria.com.br/wp-content/uploads/receitas-de-suco-de-acerola-1.jpg
//https://craftlog.com/m/i/8480954=s1280=h960

export default [
    {
        title: 'Refrigerantes',
        data: [
            {id: uuid(), drink: 'Coca-Cola', price: 7, img: 'https://www.paodeacucar.com/img/uploads/1/66/632066.jpg?type=product'},
            {id: uuid(), drink: 'Guaraná', price: 6, img: 'https://www.paodeacucar.com/img/uploads/1/558/631558.jpg?type=product'},
            {id: uuid(), drink: 'Fanta-Laranja', price: 7, img: 'https://www.paodeacucar.com/img/uploads/1/64/632064.jpg?type=product'},
            {id: uuid(), drink: 'Pepsi', price: 6, img: 'https://www.paodeacucar.com/img/uploads/1/564/631564.jpg?type=product'},
            {id: uuid(), drink: 'Fanta-Uva', price: 7, img: 'https://www.paodeacucar.com/img/uploads/1/405/615405.png?type=product'}
        ]
    },
    {
        title: 'Sucos',
        data: [
            {id: uuid(), drink: 'Suco de Laranja', price: 5, img: 'https://images.pexels.com/photos/158053/fresh-orange-juice-squeezed-refreshing-citrus-158053.jpeg'},
            {id: uuid(), drink: 'Suco de Acerola', price: 6, img: 'https://www.receiteria.com.br/wp-content/uploads/receitas-de-suco-de-acerola-1.jpg'},
            {id: uuid(), drink: 'Suco de Maracujá', price: 5, img: 'https://i.pinimg.com/originals/bb/53/d6/bb53d6b3b6f34ddb98aaf60afe3b8763.jpg'},
            {id: uuid(), drink: 'Suco de Goiaba', price: 6, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPs1fnzRIKhdJ3oe1r-KCzMSGZZqzOyW6IPWgAVJ8e-yca82jIAw&s'}
        ]
    }
]