import Axios from "axios";
const http = Axios.create({
    baseURL: import.meta.env.VITE_BASE_DELIVERY_ORDER + '/deliveryorder',
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    }
});

export function ServiceGetPlan(today) {
    return http.post('/getplans');
}

export function ServiceGetSupplier(data){
    return http.get('/getSupplier');
}
export function ServiceGetPickList(){
    return http.get('/getPickList');
}
export function ServiceSaveDo(listPlan){
    return http.post('/saveDo',listPlan);
}
