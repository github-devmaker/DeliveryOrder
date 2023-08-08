import { Button, ButtonGroup, Checkbox, CircularProgress, Divider, FormControl, FormControlLabel, FormGroup, Grid, IconButton, InputBase, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import DoneIcon from '@mui/icons-material/Done';
import CheckIcon from '@mui/icons-material/Check';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import { CheckBox } from '@mui/icons-material';
import axios from 'axios';
import { ServiceGetPlan } from '../Services';
import SearchIcon from '@mui/icons-material/Search';
import dayjs from 'dayjs';

function PartPage() {
    const [supplierSelected, setSupplierSelected] = useState('');
    const [supplier, setSupplier] = useState([]);
    const [filterType, setFilterType] = useState('stock-more');
    const [filterPdLt, setFilterPdLt] = useState(1);
    const [loadingData, setLoadingData] = useState(true);
    const [master, setMaster] = useState([]);
    const [data, setData] = useState([]);
    const [dataDefault, setDataDefault] = useState([]);
    function PuVal(props) {
        var percent = (props.po / props.usage) * 100;
        if (props.po == 0) {
            percent = 0;
        }
        return <div className='flex justify-end items-center gap-2'>
            <span class="inline-block animate-bounce rounded-full p-1 bg-red-400 text-white text-sm"><svg class="w-4 h-4 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
            </svg></span>
            <div>
                <Typography className='text-red-500 font-semibold'><ArrowDropUpIcon />({percent}%)</Typography>
                <NumericFormat value={props.po} displayType='text' thousandSeparator="," className='text-2xl' />
            </div>
            {/* <Line options={options} data={data} /> */}

        </div>
    }

    function StockInHouseVal(props) {
        var percent = ((props.stock / props.usage) * 100).toFixed(2);
        if (props.usage == 0) {
            percent = 0;
        }
        return <div className='flex justify-end items-center gap-2'>
            {/* {
                percent > 100 && <span class="inline-block animate-bounce rounded-full p-1 bg-teal-400 text-white text-sm">
                    <svg class="w-4 h-4 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
                    </svg>
                </span>
            } */}
            <div>
                {
                    percent > 100 ? <Typography className='text-red-500 font-semibold'>({percent}%)</Typography> : <Typography className='text-green-600 font-semibold'>({percent}%)</Typography>
                }
                <NumericFormat value={props.stock} displayType='text' thousandSeparator="," className='text-2xl' />
            </div>
        </div>
    }
    function getListSupplier() {
        return new Promise(resolve => {
            axios.get(import.meta.env.VITE_BASE_DELIVERY_ORDER + '/getSupplier').then((res) => {
                setSupplier(res.data);
                if (supplierSelected == '') {
                    setSupplierSelected(res.data[0].vender)
                }
                resolve(res.data)
            }).catch((error) => {
                console.log(error)
            })
        })
    }
    function getPlan(supplier = '') {
        var planBuff = {}
        var dtNow = dayjs().format('YYYYMMDD');
        var dtTo = dayjs(dtNow).add(filterPdLt, 'day').format('YYYYMMDD');
        setLoadingData(true);
        ServiceGetPlan(supplier).then((res) => {
            console.log(res.data)
            setDataDefault(res.data.data);
            var masterBuff = res.data.master;
            // var dataBuff = (res.data.data).sort((a, b) => (parseFloat(a.stock) > parseFloat(b.stock)) ? -1 : 1);
            var dtLoop = dayjs();
            var dataBuff = (res.data.data).filter(item => {
                dtLoop = dayjs(item.date).format('YYYYMMDD');
                var stock = 0;
                if (typeof planBuff[item.part] == 'undefined') {
                    planBuff[item.part] = {
                        stock: 0,
                        plan: 0,
                        desc: masterBuff[item.part]?.partDesc,
                        cm: masterBuff[item.part]?.partCm,
                        unit: masterBuff[item.part]?.partUnit,
                        code: item.part,
                        boxQty: masterBuff[item.part]?.partQtyBox,
                        period: dayjs(dtNow).format('DD/MM/YYYY') + ' - ' + dayjs(dtTo).format('DD/MM/YYYY')
                    };
                }
                if (dtLoop == dtNow) {
                    stock = item.stock;
                    planBuff[item.part]['stock'] = stock;
                }
                if (dtLoop >= dtNow && dtLoop <= dtTo) {
                    planBuff[item.part]['plan'] = planBuff[item.part]['plan'] + parseFloat(item.plan);
                }
                return dtLoop >= dtNow && dtLoop <= dtTo;
            })
            var dataFinal = [];
            Object.keys(planBuff).forEach(element => {
                let percent = ((planBuff[element].stock / planBuff[element].plan) * 100).toFixed(2);
                if(planBuff[element].plan == 0){
                    percent = 100;
                }
                planBuff[element]['percent'] = percent;
                dataFinal.push(planBuff[element])
            });
            if (filterType == 'stock-more') {
                dataFinal = dataFinal.sort((a, b) => (parseFloat(a.percent) > parseFloat(b.percent)) ? -1 : 1);
            } else {
                dataFinal = dataFinal.sort((a, b) => (parseFloat(a.percent) > parseFloat(b.percent)) ? 1 : -1);
            }
            setData(dataFinal);
            setMaster(res.data.master)
            setLoadingData(false);
        })
    }
    const handleChangeSupplier = event => {
        setSupplierSelected(event.target.value);
    }
    const handleChangeFilterType = event => {
        setFilterType(event.target.value);
    }
    const handleChangeFilterPdLt = event => {
        setFilterPdLt(event.target.value);
        var planBuff = {}
        // var dataBuff = dataDefault.sort((a, b) => (parseFloat(a.stock) > parseFloat(b.stock)) ? -1 : 1);
        var dtLoop = dayjs();
        var dtNow = dayjs().format('YYYYMMDD');
        var dtTo = dayjs(dtNow).add(event.target.value, 'day').format('YYYYMMDD');
        var dataBuff = (res.data.data).filter(item => {
            dtLoop = dayjs(item.date).format('YYYYMMDD');
            var stock = 0;

            if (typeof planBuff[item.part] == 'undefined') {
                planBuff[item.part] = {
                    stock: 0,
                    plan: 0,
                    desc: master[item.part].partDesc,
                    cm: master[item.part].partCm,
                    unit: master[item.part].partUnit,
                    code: item.part,
                    boxQty: master[item.part]?.partQtyBox,
                    period: dayjs(dtNow).format('DD/MM/YYYY') + ' - ' + dayjs(dtTo).format('DD/MM/YYYY')
                };
            }
            if (dtLoop == dtNow) {
                stock = item.stock;
                planBuff[item.part]['stock'] = stock;
            }
            if (dtLoop >= dtNow && dtLoop <= dtTo) {
                planBuff[item.part]['plan'] = planBuff[item.part]['plan'] + parseFloat(item.plan);
            }
            return dtLoop >= dtNow && dtLoop <= dtTo;
        })
        var dataFinal = [];
        Object.keys(planBuff).forEach(element => {
            dataFinal.push(planBuff[element])
        });
        setData(dataFinal);
    }
    const handleGetData = () => {
        getPlan(supplierSelected);
    }
    var once = false;
    useEffect(() => {
        async function getData() {
            await getListSupplier();
            await getPlan(supplierSelected);
        }
        if (!once) {
            getData();
            once = true;
        }
    }, [])

    return (
        <div>
            <Grid container>
                <Grid item xs={12} className='px-6 pt-3 pb-0'>
                    <Paper className='pt-2 pl-1 pb-1'>
                        <Stack className='px-3 pt-1 pb-2' direction={'row'} spacing={2} alignItems={'center'} justifyContent={'space-between'}>
                            <span className='text-[#1976d2] text-[1rem]'>FILTER</span>
                            <FormControl fullWidth size='small' focused>
                                <InputLabel id="demo-simple-select-label">SUPPLIER</InputLabel>
                                <Select label="SUPPLIER" value={supplierSelected} onChange={handleChangeSupplier}>
                                    {
                                        supplier.map((item, index) => (
                                            <MenuItem value={item.vender} key={item.vender}>{item.venderName} ({item.vender})</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                            <FormControl fullWidth size='small' focused>
                                <InputLabel id="demo-simple-select-label">View</InputLabel>
                                <Select label="View" value={filterType} onChange={handleChangeFilterType}>
                                    <MenuItem value={'stock-more'}>Stock มาก</MenuItem>
                                    <MenuItem value={'stock-less'}>Stock น้อย</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth size='small' focused>
                                <InputLabel id="demo-simple-select-label">PD/LT</InputLabel>
                                <Select label="PD/LT" value={filterPdLt} onChange={handleChangeFilterPdLt}>
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                    <MenuItem value={4}>4</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                </Select>
                            </FormControl>
                            <Button variant='contained' className='min-w-[100px]' onClick={handleGetData}><SearchIcon />Search</Button>
                        </Stack>
                    </Paper>
                </Grid>
                <Grid item xs={12} className='px-6 pt-3 pb-6'>
                    <TableContainer component={Paper}>
                        <Table size='small'>
                            <TableHead>
                                <TableRow>
                                    <TableCell className='font-semibold text-center'>DRAWING NO.</TableCell>
                                    <TableCell className='font-semibold text-center'>CM</TableCell>
                                    <TableCell className='font-semibold text-center'>DESCRIPTION</TableCell>
                                    <TableCell className='font-semibold text-center '>QTY/BOX</TableCell>
                                    <TableCell className='font-semibold text-center'>UNIT</TableCell>
                                    <TableCell className='font-semibold text-center bg-blue-200'>PERIOD PLAN</TableCell>
                                    <TableCell className='py-3 font-semibold text-center bg-blue-200'>REQUIRE PLAN</TableCell>
                                    <TableCell className='font-semibold text-center bg-yellow-200'>P/S STOCK</TableCell>
                                    {/* <TableCell className='text-right font-semibold'>PURCHASE ORDER</TableCell> */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    loadingData ? <TableRow><TableCell colSpan={8}><div className='flex flex-col p-3 justify-center items-center gap-2'><CircularProgress /><span>กำลังโหลดข้อมูล . . .</span></div></TableCell></TableRow> : (
                                        data.length ? data.map((item, index) => {
                                            return <TableRow>
                                                <TableCell className='font-semibold'>{item.code} </TableCell>
                                                <TableCell className='font-semibold'>{item.cm}</TableCell>
                                                <TableCell className='font-semibold'>{typeof item.desc != 'undefined' ? item.desc : 'PACKAGING'}</TableCell>
                                                <TableCell className='font-semibold text-right'>{typeof item.boxQty != 'undefined' ? <NumericFormat value={item.boxQty} displayType='text' className='text-[14px]' thousandSeparator="," /> : '-'}</TableCell>
                                                <TableCell className='font-semibold'>{typeof item.unit != 'undefined' ? item.unit : '-'}</TableCell>
                                                <TableCell className='font-semibold text-center bg-blue-50'>{item.period} </TableCell>
                                                <TableCell className='text-right font-semibold bg-blue-50'><NumericFormat value={item.plan} displayType='text' className='text-3xl' thousandSeparator="," /></TableCell>
                                                <TableCell className='text-right font-semibold bg-yellow-100'><StockInHouseVal usage={item.plan} stock={item.stock}  /></TableCell>
                                                {/* <TableCell className='text-right font-semibold'><PuVal usage={2900} po={5800} /></TableCell> */}
                                            </TableRow>
                                        }) : <TableRow><TableCell colSpan={8} className='text-center p-3'>ไม่พบข้อมูล</TableCell></TableRow>
                                    )
                                }

                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </div>
    )
}

export default PartPage