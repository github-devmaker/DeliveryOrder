const initialState = {
    login: false,
    id: '', // Employee id
    name: '',
    division: '',
    module: '',
    titles: [{ name: 'plan', label: 'Prod Plan (Plan * BOM)', disabled: false, checked: true, bgColor: 'bg-yellow-500' },
    { name: 'picklist', label: 'Picklist', disabled: false, checked: false, bgColor: 'bg-red-500' },
    { name: 'produse', label: 'Prod.Use', disabled: false, checked: false, bgColor: 'bg-orange-500' },
    { name: 'doplan', label: 'D/O Plan', disabled: false, checked: true, bgColor: 'bg-green-500' },
    { name: 'doact', label: 'D/O Act.', disabled: false, checked: false, bgColor: 'bg-teal-400' },
    { name: 'wip', label: 'WIP', disabled: false, checked: false, bgColor: 'bg-gray-400' },
    { name: 'stock', label: 'P/S Stock', disabled: false, checked: false, bgColor: 'bg-orange-500' },
    { name: 'stocksimulate', label: 'P/S Stock Simulate', disabled: false, checked: true, bgColor: 'bg-blue-600' },
    { name: 'po', label: 'PO', disabled: false, checked: true, bgColor: 'bg-teal-500' }],
    dayOfWeek: [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
    ]
}

const IndexReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CLEAR_LOGIN':
            return {
                ...state,
                login: false,
                id: ''
            }
        case 'INIT_LOGIN':
            return {
                ...state,
                ...action.payload
            }
        case 'INIT_DIV':
            return {
                ...state,
                division: action.payload.division,
                module: ''
            }
        case 'INIT_MODULE':
            return {
                ...state,
                ...action.payload
            }
        case 'CLEAR_MENU':
            return {
                ...state,
                division: '',
                module: ''
            }
        case 'CHECKED_FILTER':
            var index = state.titles.findIndex((item) => item.name == action.name)
            state.titles[index].checked = action.checked;
            return {
                ...state
            }
        default:
            return state
    }
}
export default IndexReducer;
