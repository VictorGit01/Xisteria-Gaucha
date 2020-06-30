// Objetos de mesclagem rasa:

/*
let obj1 = {
    name: 'prashant',
    age: 23,
}

let obj2 = {
    qualification: 'BSC CS',
    loves: 'Javascript',
}
// Usando o operador (...) spread
let merge = {...obj1, ...obj2}

console.log(merge)
*/


// Usando o método Object.assign():
// Ex: Object.assign(target, source1, source2, ...)
/*
let obj1 = {
    name: 'prashant',
    age: 23,
}

let obj2 = {
    qualification: 'BSC CS',
    loves: 'Javascript'
}

let merge = Object.assign({}, obj1, obj2)

console.log(merge)
*/


// Usando a função personalizada para mesclar objetos:
/*
let merge = (...arguments) => {
    // Create a new object
    let target = {}

    // Merge the object into the target object
    let merger = (obj) => {
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                // Push each value from `obj` into `target`
                target[prop] = obj[prop]
            }
        }
    }

    // Loop through each object and conduct a merge
    for (let i = 0; i < arguments.length; i++) {
        merger(arguments[i])
    }

    return target
}

let obj1 = {
    name: 'prashant',
    age: 23,
}

let obj2 = {
    qualification: 'BSC CS',
    loves: 'Javascript',
}

let merged = merge(obj1, obj2)

console.log(merged)
*/


// Objetos de mesclagem profunda:
/*
let merge = (...arguments) => {

    // Variables
    let target = {}

    // Merge the object into the target object
    let merger = (obj) => {
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                if (Object.prototype.toString.call(obj[prop]) === '[object Obeject]') {
                    // If we're doing a deep merge and the property is object
                    target[prop] = merge(target[prop], obj[prop])
                } else {
                    // Otherwise, do a regular merge
                    target[prop] = obj[prop]
                }
            }
        }
    }

    // Loop through each object and conduct a merge
    for (let i = 0; i < arguments.length; i++) {
        merger(arguments[i])
    }

    return target
}

let obj1 = {
    name: 'prashant',
    age: 23,
    nature: {
        "helping": true,
        "shy": false
    }
}

let obj2 = {
    name: 'Paulo',
    qualification: 'BSC CS',
    loves: 'Javascript',
    nature: {
        "angry" : false,
        "shy" : true
    }
}

console.log(merge(obj1, obj2))
*/


var myArray = [
    {id: 1, name: 'Foo Bar', email: 'foo@bar.com'},
    {id: 2, name: 'Bar Foo', email: 'bar@foo.com'},
    {id: 3, name: 'Joe Ocean', email: 'joe@ocean.com'},
    {id: 3, name: 'Jenny Block', email: 'foo@bar.com'},
]

function checkDuplicateInObject(propertyName, inputArray) {
    var seenDuplicate = false,
    testObject = {}
    inputArray.map(function(item) {
        var itemPropertyName = item[propertyName]
        if (itemPropertyName in testObject) {
            testObject[itemPropertyName].duplicate = true
            item.duplicate = true
            seenDuplicate = true
        } else {
            testObject[itemPropertyName] = item
            delete item.duplicate
        }
    })
    return seenDuplicate
}

console.log(checkDuplicateInObject(myArray[1].email, myArray))