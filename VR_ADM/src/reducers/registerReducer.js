const initialState = {
    schedulesP1: [],
    schedulesP2: [],
    bannerImg: null,
}

export default (state = initialState, action) => {

    switch(action.type) {
        case 'SET_SCHEDULESP1':
            return {...state, schedulesP1: action.payload.schedulesP1};
            break;
        case 'SET_SCHEDULESP2':
            return {...state, schedulesP2: action.payload.schedulesP2};
            break;
        case 'SET_BANNER_IMG':
            return {...state, bannerImg: action.payload.bannerImg};
            break;
    }

    return state;
}