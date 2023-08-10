import { Button, CircularProgress, FormControl, Grid, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, tableCellClasses } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ServiceGetPlan, ServiceGetSupplier } from '../Services';
import axios from 'axios';
import dayjs from 'dayjs';
import { NumericFormat } from 'react-number-format';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import { useSelector } from 'react-redux';
function SupplierPage() {
    const headers = [
        'D/O Date', 'Drawing No', 'Cm', 'Decription', 'D/O NO', 'DEL.DATE', 'TIME', 'W/H NO', 'DEL.PLACE', 'QTY/BOX', 'UNIT', 'D/O QTY', 'R/C QTY', 'REMAIN', 'STATUS'
    ]
    // const StyledTableCell = styled(TableCell)(({ theme }) => ({
    //     [`&.${tableCellClasses.head}`]: {
    //         backgroundColor: theme.palette.common.black,
    //         color: theme.palette.common.white
    //     },
    //     [`&.${tableCellClasses.body}`]: {
    //         fontSize: 14,
    //     },
    // }));

    // const StyledTableRow = styled(TableRow)(({ theme }) => ({
    //     '&:nth-of-type(odd)': {
    //         backgroundColor: theme.palette.action.hover,
    //     },
    //     '&:last-child td, &:last-child th': {
    //         border: 0,
    //     },
    // }));
    const [supplierSelected, setSupplierSelected] = useState('');
    const [supplier, setSupplier] = useState([]);
    const [master, setMaster] = useState([]);
    const [supplierData, setSupplierData] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    const themeLight = {
        bg: '#ffffff',
        color: '#1f1f1f'
    };
    const themeNight = {
        bg: '#1f1f1f',
        color: '#dfdfdf'
    };
    const [themeSys, setThemeSys] = useState(true);
    const reducer = useSelector(state => state.mainReducer);
    function getListSupplier() {
        return new Promise(resolve => {
            axios.get(import.meta.env.VITE_BASE_DELIVERY_ORDER + '/getSupplier').then((res) => {
                setSupplier(res.data);
                if (supplierSelected == '') {
                    setSupplierSelected(res.data[0].vender)
                }
                resolve(res.data[0].vender)
            }).catch((error) => {
                console.log(error)
            })
        })
    }

    function getPlan(supplier = '') {
        setLoadingData(true);
        ServiceGetPlan(supplier).then((res) => {
            setSupplierData((res.data.data).sort((a, b) => (a.date > b.date) ? 1 : -1).filter(item => {
                return item.doPlan > 0
            }));
            setMaster(res.data.master);
            setLoadingData(false);
        })
    }

    const handleSupplier = async event => {
        await setSupplierSelected(event.target.value);
    }
    const handleSearch = () => {
        getPlan(supplierSelected);
    }
    var once = false;
    useEffect(() => {

        async function getData() {
            const supplier = await getListSupplier();
            await getPlan(supplier);
        }
        if (!once) {
            getData();
            once = true;
        }
    }, [])

    return (
        <div className='supplier-page w-full flex'>
            <div className={`overflow-hidden w-full p-6  ${themeSys ? 'night' : 'light'}`}>
                <div className='flex flex-col w-full h-full box-content'>
                    <div className='flex gap-2 box-filter line-b'>
                        <AirportShuttleIcon className='text-md text-[#4effca]' />
                        <FormControl fullWidth>
                            <Select
                                size='small'
                                value={supplierSelected}
                                onChange={handleSupplier}
                                sx={{
                                    height: '1.75rem',
                                    color: 'white',
                                    fontSize: '14px',
                                    lineHeight: 2,
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#4effca60'
                                    },
                                    '& .MuiSvgIcon-root': {
                                        color: '#4effca'
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#4effca',
                                    },
                                    "&:hover": {
                                        "&& fieldset": {
                                            border: "1px solid #4effca50"
                                        }
                                    }
                                }}
                            >
                                {
                                    supplier.map((sp) => {
                                        return <MenuItem value={sp.vender} key={sp.vender}>{sp.venderName} ({sp.vender})</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                        <div className={`bg-[#4effca] text-[#080b0f] w-fit rounded-[8px] px-[8px] pt-[0px] pb-[4px] cursor-pointer transition ease-in-out delay-50  hover:-translate-y-1 hover:scale-105 hover:bg-[#4effca] hover:text-[#080b0f] duration-300 shadow-mtr w-fit`} onClick={handleSearch}>
                            <Stack alignItems={'center'} direction={'row'}>
                                <ElectricBoltIcon className='text-[.75vw] mr-1' />
                                <span className='text-center'>ค้นหา</span>
                            </Stack>
                        </div>
                    </div>
                    <div className='h-full w-full text-center p-6'>
                        <div className='flex w-full h-full'>
                            <TableContainer component={Paper}>
                                <Table size='small' className='tbContent'>
                                    <TableHead>
                                        <TableRow>
                                            {
                                                headers.map((header, index) => (
                                                    <TableCell key={index} >{header.toUpperCase()}</TableCell>
                                                ))
                                            }
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            loadingData ? <TableRow>
                                                <TableCell colSpan={15} className='text-center'>
                                                    <Stack spacing={1} alignItems={'center'}>
                                                        <CircularProgress />
                                                        <Typography variant='span'>กำลังโหลดข้อมูล  . . . </Typography>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow> : (supplierData.length ? supplierData.map((item, index) => {
                                                return <TableRow key={index}>
                                                    <TableCell className='text-center font-semibold'>{dayjs(item.date).format('DD/MM/YYYY')}</TableCell>
                                                    <TableCell className='text-center font-semibold'>{item.part}</TableCell>
                                                    <TableCell className='text-center'>{master[item.part].partCm}</TableCell>
                                                    <TableCell className='text-left pl-3'>{master[item.part].partDesc}</TableCell>
                                                    <TableCell className='text-center'>20230802001</TableCell>
                                                    <TableCell className='text-center font-semibold'>{dayjs(item.date).format('DD/MM/YYYY')}</TableCell>
                                                    <TableCell className='text-center'>09:00</TableCell>
                                                    <TableCell className='text-center'>W1</TableCell>
                                                    <TableCell className='text-center'>PART SUPPLY</TableCell>
                                                    <TableCell className='text-right font-semibold'><NumericFormat displayType='text' thousandSeparator="," value={master[item.part].partQtyBox} decimalScale={2} /></TableCell>
                                                    <TableCell className='text-center'>{master[item.part].partUnit}</TableCell>
                                                    <TableCell className='text-right font-semibold text-green-600'><NumericFormat displayType='text' thousandSeparator="," value={item.doPlan} decimalScale={2} /></TableCell>
                                                    <TableCell className='text-center'>-</TableCell>
                                                    <TableCell className='text-right font-semibold text-red-500'><NumericFormat displayType='text' thousandSeparator="," value={item.doPlan} decimalScale={2} /></TableCell>
                                                    <TableCell className='text-center'><div className='bg-[#ff9800] text-white rounded-lg px-3 py-1'>Pending</div></TableCell>
                                                </TableRow>
                                            }) : <TableRow><TableCell colSpan={15} className='text-center'>ไม่พบข้อมูล</TableCell></TableRow>)
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SupplierPage