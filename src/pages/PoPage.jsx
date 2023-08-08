import { Button, CircularProgress, Divider, FormControl, FormControlLabel, FormGroup, Grid, IconButton, InputBase, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { GetVenders } from '../Services';
import SearchIcon from '@mui/icons-material/Search';
import dayjs from 'dayjs';
import { GET_PO } from '../Services/poService';
import { useDispatch, useSelector } from 'react-redux';

function PoPage() {
    const [supplierSelected, setSupplierSelected] = useState('');
    const [filterType, setFilterType] = useState('desc');
    const [filterPdLt, setFilterPdLt] = useState(3);
    const [loadingData, setLoadingData] = useState(true);
    const [data, setData] = useState([]);
    const reducer = useSelector(state => state.mainReducer);
    const dispatch = useDispatch();


    var once = false;
    function StockInHouseVal(props) {
        return <div className='flex justify-end items-center gap-2'>
            <div>
                {
                    props.percent >= 95 && props.percent <= 110 ? <Typography className='text-green-600 font-semibold'> ({props.percent}%)</Typography> : <Typography className='text-red-500 font-semibold'>({props.percent}%)</Typography>
                }
                <NumericFormat value={props.val} displayType='text' thousandSeparator="," className='text-2xl' />
            </div>
        </div>
    }

    const handleGetData = async () => {
        setLoadingData(true);
        const data = await GET_PO({ vender: supplierSelected, startDate: dayjs().format('YYYYMMDD'), endDate: dayjs().add(filterPdLt * 7, 'day').format('YYYYMMDD'), sort: filterType });
        setData(data);
        console.log(data);
        setLoadingData(false);
    }
    useEffect(() => {
        if (!once) {
            async function SetEnv() {
                dispatch({ type: 'SET_VENDER', payload: await GetVenders() });
                setSupplierSelected(reducer.vender[0].vender);
                const data = await GET_PO({ vender: reducer.vender[0].vender, startDate: dayjs().format('YYYYMMDD'), endDate: dayjs().add(7, 'day').format('YYYYMMDD') });
                setData(data);
                setLoadingData(false);
            }
            SetEnv()
            once = true;
        }
    }, [])
    return (
        <Grid container>
            <Grid item xs={12} className='px-6 pt-3 pb-0'>
                <Paper className='pt-2 pl-1 pb-1'>
                    <Stack className='px-3 pt-1 pb-2' direction={'row'} spacing={2} alignItems={'center'} justifyContent={'space-between'}>
                        <span className='text-[#1976d2] text-[1rem]'>FILTER</span>
                        <FormControl fullWidth size='small' focused>
                            <InputLabel id="demo-simple-select-label">SUPPLIER</InputLabel>
                            <Select label="SUPPLIER" value={supplierSelected} onChange={(event) => setSupplierSelected(event.target.value)}>
                                {
                                    reducer?.vender?.map((item, index) => (
                                        <MenuItem value={item.vender} key={index}>{item.venderName} ({item.vender})</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <FormControl fullWidth size='small' focused>
                            <InputLabel id="demo-simple-select-label">View</InputLabel>
                            <Select label="View" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                                <MenuItem value={'desc'}>PO มากเกิน</MenuItem>
                                <MenuItem value={'asc'}>PO ไม่พอ</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth size='small' focused>
                            <InputLabel id="demo-simple-select-label">PD PLAN</InputLabel>
                            <Select label="PD PLAN" value={filterPdLt} onChange={(e) => setFilterPdLt(e.target.value)}>
                                <MenuItem value={1}>1 Week</MenuItem>
                                <MenuItem value={2}>2 Week</MenuItem>
                                <MenuItem value={3}>3 Week</MenuItem>
                                <MenuItem value={4}>4 Week</MenuItem>
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
                                <TableCell className='font-semibold text-center '>P/S STOCK</TableCell>
                                <TableCell className='font-semibold text-center bg-yellow-200'>PO BAL</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                loadingData ? <TableRow><TableCell colSpan={9}><div className='flex flex-col p-3 justify-center items-center gap-2'><CircularProgress /><span>กำลังโหลดข้อมูล . . .</span></div></TableCell></TableRow> : (
                                    data.length ? data.map((item, index) => {
                                        return <TableRow key={index}>
                                            <TableCell className='font-semibold'>{item.PARTNO} </TableCell>
                                            <TableCell className='font-semibold'>{item.CM}</TableCell>
                                            <TableCell className='font-semibold'>{(typeof item.PARTNAME != 'undefined' && item.PARTNAME != "null"  && item.PARTNAME != null) ? item.PARTNAME : 'PACKAGING'}</TableCell>
                                            <TableCell className='font-semibold text-right'>{ (typeof item.BOX_QTY != 'undefined' && item.BOX_QTY != null ) ? <NumericFormat value={item.BOX_QTY} displayType='text' className='text-[14px]' thousandSeparator="," /> : '-'}</TableCell>
                                            <TableCell className='font-semibold'>{typeof item.UNIT != 'undefined' ? item.UNIT : '-'}</TableCell>
                                            <TableCell className='font-semibold text-center bg-blue-50'>{dayjs(item.PERIOD_START).format('DD/MM/YYYY')} - {dayjs(item.PERIOD_END).format('DD/MM/YYYY')}</TableCell>
                                            <TableCell className='text-right font-semibold bg-blue-50'><NumericFormat value={item.PLAN_QTY} displayType='text' className='text-3xl' thousandSeparator="," /></TableCell>
                                            <TableCell className='text-right font-semibold '><StockInHouseVal percent={item.STOCK_PERCENT} val={item.STOCK} /></TableCell>
                                            <TableCell className='text-right font-semibold bg-yellow-100'><StockInHouseVal percent={item.PO_PERCENT} val={item.PO} /></TableCell>
                                        </TableRow>
                                    }) : <TableRow><TableCell colSpan={9} className='text-center p-3'>ไม่พบข้อมูล</TableCell></TableRow>
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    )
}
export default PoPage