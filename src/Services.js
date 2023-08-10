import Axios from "axios";
const http = Axios.create({
    baseURL: import.meta.env.VITE_BASE_DELIVERY_ORDER,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    }
});

export default http;

export function ServiceGetPlan(vdCode, currentDate, startDate, endDate) {
    return http.post('/getplans', { vdCode: vdCode, currentDate: currentDate, startDate: startDate, endDate: endDate });
}

export function ServiceGetSupplier(data) {
    return http.get('/getSupplier');
}
export function ServiceGetPickList() {
    return http.get('/getPickList');
}
export function ServiceApproveDo(data) {
    return http.post('/setDoPlan', data);
}

export function ServiceRunDo(data) {
    return http.post('/RunDo', data);
}

export function GetVenders() {
    return new Promise(resolve => {
        http.get('/getSupplier').then((res) => {
            resolve(res.data);
        }).catch(() => {
            console.log('catch')
            resolve([]);
        })
    })
}

export function GET_STOCK(data) {
    return new Promise(resolve => {
        http.post('/data/stock', data).then((res) => {
            resolve(res.data);
        }).catch(() => {
            resolve([]);
        })
    })
}




