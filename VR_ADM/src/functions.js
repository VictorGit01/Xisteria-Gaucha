import { ToastAndroid, Dimensions } from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import firebase from '../firebase';

const { height, width } = Dimensions.get('window');

import {
    widthPercentageToDP as wp2dp,
    heightPercentageToDP as hp2dp,
} from 'react-native-responsive-screen';

window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = RNFetchBlob.polyfill.Blob;

export function insertImage(cityId, id, image, setLoaderVisible) {
    const currentCity = firebase.auth().currentUser;
    const posts_img = firebase.storage().ref().child('posts');

    function toastMsg(msg) {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            180,
        )
    }

    // if (currentCity) {
    //     // const cityId = currentCity.uid
    //     // const id = uuid()

    //     // setLoaderVisible(true)
    return new Promise((resolve, reject) => {
        let uri = image.uri.replace('file://', '')
        let img = posts_img.child(cityId).child('banners').child(`${id}.jpg`)
        let mime = 'image/jpeg'

        RNFetchBlob.fs.readFile(uri, 'base64')
        .then((data) => {
            return RNFetchBlob.polyfill.Blob.build(data, {type: mime+';BASE64'})
        })
        .then((blob) => {

            img.put(blob, {contentType: mime})
            .then(() => {
                blob.close()
                
                // setTimeout(() => {
                //     setLoaderVisible(false)
                //     toastMsg('Imagem inserida no banco de dados.')
                // }, 1500)
                resolve(true);
                // if (message) {
                //     toastMsg(message)
                // }
            })
            .catch((error) => {
                // setLoaderVisible(false)
                console.log(error)
                toastMsg(`${error.code} - ${error.message}`)
                resolve(false);
            })

        })
        .catch((error) => {
            // setLoaderVisible(false)
            console.log(error)
            toastMsg(`${error.code} - ${error.message}`)
            resolve(false);
        })
    })
    // }
};

export const wp = dimension => {
    // return wp2dp((dimension / 360) * 100 + '%');
    return wp2dp((dimension / 392.72) * 100 + '%');
};

export const hp = dimension => {
    // return hp2dp((dimension / 760) * 100 + '%');
    return hp2dp((dimension / 738.18) * 100 + '%');
};

// export const normalize = size => {
//     return ((hp(640) + wp(360)) * size) / (hp(640) + wp(360));
// }

export const normalize = size => {
    // return ((wp(width) + hp(height)) * size) / (height + width);
    return ((wp(height) + hp(width)) * size) / (height + width);
};

// export const normalize = size => {
//     return hp(size)
// }