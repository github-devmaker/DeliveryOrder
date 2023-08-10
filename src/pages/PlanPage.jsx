import React, { useEffect, useState } from 'react'
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import '../App.css'
import { Box, CircularProgress, Divider, Table, TableBody, TableCell, TableContainer, TableRow, TableHead, Paper, Button, Select, Stack, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Avatar, IconButton, InputBase, Typography, FormGroup, FormControlLabel, Checkbox, FormLabel, Grid, TextField, List, ListItemButton, ListItemIcon, Collapse, ListItemText, tableCellClasses } from '@mui/material'
import { TableVirtuoso } from 'react-virtuoso'
import { ServiceGetPlan, ServiceGetSupplier, ServiceRunDo } from '../Services'
import moment from 'moment/moment'
import CheckIcon from '@mui/icons-material/Check';
import HomeIcon from '@mui/icons-material/Home';
import ItemCell from '../components/ItemCell'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { red } from '@mui/material/colors';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import LoginPage from '../components/LoginPage'
import { useDispatch, useSelector } from 'react-redux'
import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined';
import CheckBoxFilter from '../components/CheckBoxFilter'
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DiamondIcon from '@mui/icons-material/Diamond';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import WidgetsIcon from '@mui/icons-material/Widgets';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
function PlanPage() {
    const mainColor = '#4effca';
    const [plan, setPlan] = useState([]);
    const [parts, setParts] = useState([]);
    const [columns, setColumns] = useState([]);
    const [master, setMaster] = useState([]);
    const [holiday,setHoliday] = useState([]);
    const [planDefault, setPlanDefault] = useState([]);
    const [ListSupplier, SetListSupplier] = useState([]);
    const [SupplierSelected, SetSupplierSelected] = useState('012016');
    const [loading, setLoading] = useState(true);
    const [msgNoData, setMsgNoData] = useState(false);
    const [openApprDo, setOpenApprDo] = useState(false);
    const [loadingApprDo, setLoadingApprDo] = useState(false);
    const [disabledBtnApprDo, setDisabledBtnApprDo] = useState(false);
    const [msgWaitApprDo, setMsgWaitApprDo] = useState('กรุณารอสักครู่ . . .');
    const [RunningCode, setRunningCode] = useState('-');
    const [showBtnRunDo, setShowBtnRunDo] = useState(true);
    const [openFilter, setOpenFilter] = useState(false);
    const [openViewDetailDrawing, setOpenViewDetailDrawing] = useState(false);
    const [drawingDetail, setDrawingDetail] = useState([]);
    const reducer = useSelector(state => state.mainReducer);
    const dispatch = useDispatch();
    var startDate = moment().add(-7, 'days').format('YYYY-MM-DD');
    var endDate = moment().add(1, 'months').format('YYYY-MM-DD');
    var ranonce = false;

    const themeLight = {
        bg: '#ffffff',
        color: '#1f1f1f'
    };
    const themeNight = {
        bg: '#1f1f1f',
        color: '#dfdfdf'
    };
    const [themeSys, setThemeSys] = useState(true); // True is Night , Flase is Light

    useEffect(() => {
        if (!ranonce) {
            if (reducer.login) {
                setShowBtnRunDo(true);
                GetSupplier();
                GetPlan();
                SetColDay();
                ranonce = true;
            }
        }
    }, [reducer.login]);
    function GetSupplier() {
        ServiceGetSupplier().then((res) => {
            SetListSupplier(res.data);
        })
    }
    function GetPlan(SupplierCode) {
        SupplierCode = (SupplierCode != "" && typeof SupplierCode != 'undefined') ? SupplierCode : SupplierSelected;
        SetSupplierSelected(SupplierCode);
        setLoading(true);
        setMsgNoData(false);
        ServiceGetPlan(SupplierCode).then((res) => {
            console.log(res.data)
            setLoading(false);
            setHoliday(res.data.holiday.map(el => el.code));
            setRunningCode(res.data.runningCode != '' ? res.data.runningCode : '-');
            if (Object.keys(res.data.data).length) {
                setMaster(res.data.master);
                var newPlan = [];
                setPlanDefault(res.data.data);
                res.data.data.map((item) => {
                    if (typeof newPlan[item.part] == 'undefined') {
                        newPlan[item.part] = []
                    }
                    if (item.date != null && (moment(item.date) >= moment(startDate) && moment(item.date) <= moment(endDate))) {
                        newPlan[item.part].push(item);
                    }
                });
                setPlan(newPlan);
                setParts(Object.keys(newPlan));
            } else {
                setMsgNoData(true);
                setPlanDefault([]);
                setPlan([]);
                setParts([]);
            }
        });
    }
    function SetColDay() {
        var column = [];
        var sDate = moment(startDate);
        var fDate = moment(endDate);
        while (!sDate.isSame(fDate)) {
            column.push({
                label: sDate.format('YYYY-MM-DD'),
                date: sDate.format('YYYY-MM-DD'),
                width: 85,
                height: 40,
                type: 'day',
                numeric: false
            });
            sDate.add(1, 'day');
        }
        column.push({
            label: sDate.format('YYYY-MM-DD'),
            date: sDate.format('YYYY-MM-DD'),
            width: 85,
            height: 40,
            type: 'day',
            numeric: false
        });
        setColumns(column);
    }

    function fixedHeaderContent() {
        return (
            <>
                <TableRow>
                    <TableCell rowSpan={4} className={` w-[400px] p-0 text-center stuck text-[${themeSys ? themeNight.color : themeLight.color}]`}>
                        <div className={`flex `}>
                            <div className='flex-1 text-[1.5rem] text-left pl-6'>DRAWING NO.</div>
                            <div className='flex-1 text-[1.5rem]'>{moment(startDate).format('MMM').toUpperCase()}</div>
                        </div>
                    </TableCell>
                    {columns.map((column, i) => {
                        var _ThStartMonth = "";
                        if (column.date == moment(endDate).format('YYYY-MM-01')) {
                            _ThStartMonth = <TableCell rowSpan={2} className='text-center w-[200px] start-[200px] text-[1.5rem] stuck text-white thMonth' style={{ width: column.width, padding: 0, height: column.height, borderRight: '1px solid #e0e0e0 !important' }}>{moment(endDate).format('MMM').toUpperCase()}</TableCell>
                        }
                        return <>
                            {_ThStartMonth}
                            <TableCell
                                className={`${isHoliday(column.label)} ${styleDay(column)} `}
                                key={i}
                                variant="head"
                                align={column.numeric || false ? 'center' : 'center'}
                                style={{ width: column.width, padding: 0, height: column.height, maxWidth: '75px' }}
                            >
                                {
                                    column.type == 'day' && moment(column.label).format('ddd')
                                }
                            </TableCell></>
                    })
                    }

                </TableRow >
                <TableRow>
                    {columns.map((column, i) => (
                        <TableCell
                            className={`${isHoliday(column.label)} ${styleDay(column)}`}
                            key={i}
                            align={column.numeric || false ? 'center' : 'center'}
                            style={{ width: column.width, padding: 0, height: column.height }}
                        >
                            {
                                column.type == 'day' && moment(column.label).format('D')
                            }
                        </TableCell>
                    ))
                    }
                </TableRow>
            </>
        );
    }
    function isHoliday(days) {
        return moment(days, 'YYYY-MM-DD').format('ddd');
    }
    function styleDay(column) {
        var diff = moment(column.date).diff(moment().format('YYYY-MM-DD'), 'days');
        if (diff == 0) {
            return 'today';
        } else if (diff > 0 && diff <= 6) {
            return 'fix';
        } else if (diff > 6 && diff < 14) {
            return 'do';
        } else {
            return column.label;
        }
    }
    const VirtuosoTableComponents = {
        Scroller: React.forwardRef((props, ref) => (
            <TableContainer component={Paper} {...props} ref={ref} className={`bg-transparent`} />
        )),
        Table: (props) => (
            <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} className={`bg-[${themeSys ? themeNight.bg : themeLight.bg}]`} />
        ),
        TableHead: ({ item: _item, ...props }) => <TableHead {...props} />,
        TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
        TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
    }
    function ApprDo() {
        ServiceRunDo({ plan: planDefault, master: master }).then((res) => {
            try {
                if (res.status == 200) {
                    if (res.data.runningCode != "" && typeof res.data.runningCode != 'undefined') {
                        setRunningCode(res.data.runningCode);
                    }
                    setMsgWaitApprDo('ออกแผน Delivery Order สำเร็จแล้ว');
                    setShowBtnRunDo(false);
                } else {
                    setMsgWaitApprDo('ไม่สามารถออกแผน Delivery Order ได้ กรุณาติดต่อทีมงาน IT (เบียร์ 250)');
                }
                setDisabledBtnApprDo(false);
            } catch (e) {
                setDisabledBtnApprDo(false);
                setMsgWaitApprDo('ไม่สามารถออกแผน Delivery Order ได้ กรุณาติดต่อทีมงาน IT (เบียร์ 250)');
            }
        })
    }
    const handleSupplier = event => {
        SetSupplierSelected(event.target.value);
        GetPlan(event.target.value);
    }
    const handleCloseApprDo = () => {
        setLoadingApprDo(false);
        setOpenApprDo(false);
    }
    const confirmApprDo = () => {
        setMsgWaitApprDo('กรุณารอสักครู่ . . .')
        setLoadingApprDo(true);
        setDisabledBtnApprDo(true);
        ApprDo();
    }

    return (
        <>
            {
                reducer.login ? <div className={`overflow-hidden w-full  p-6 ${themeSys ? 'night' : 'light'}`}>
                    <Grid container className='sm:h-auto bg-[#181818]  pl-4 line-b'>
                        <Grid item xs={11.25} className='flex items-center'>
                            <AirportShuttleIcon className='text-md text-[#4effca]' />
                            <FormControl fullWidth className=' py-2 px-2'>
                                <Select
                                    inputProps={{ readOnly: loading }}
                                    size='small'
                                    value={SupplierSelected}
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
                                        ListSupplier.map((sp) => {
                                            return <MenuItem value={sp.vender} key={sp.vender}>{sp.venderName} ({sp.vender})</MenuItem>
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={.75} className='items-center flex'>
                            <div className='bg-[#4effca] rounded-s-[.5vw] transition-all duration-300 hover:scale-110 w-full' onClick={() => setOpenFilter(true)}>
                                <Button size='small' className={` border-[${mainColor + '20'}] text-[#37393c]  hover:bg-[${mainColor + '90'}] text-[.75vw]`}><FilterAltOffOutlinedIcon className='text-md ' />&nbsp;Filter</Button>
                            </div>
                        </Grid>
                    </Grid>
                    <div className='bg-[#181818] text-[#ffffffc7] px-3 py-1 font-thin flex items-center gap-2 line-b'>
                        <DiamondIcon className='text-yellow-300 ' />
                        <span>&nbsp;D/O RUNNING : </span>
                        <span className='text-[#4effca]'>20230807001</span>
                        <div className={`bg-[#4effca] text-[#080b0f] w-fit rounded-[8px] px-[8px] pt-[0px] pb-[4px] cursor-pointer transition ease-in-out delay-50  hover:-translate-y-1 hover:scale-105 hover:bg-[#4effca] hover:text-[#080b0f] duration-300 shadow-mtr w-fit animate-bounce hover:animate-pulse `} onClick={() => setOpenApprDo(true)}>
                            <Stack alignItems={'center'} direction={'row'}>
                                <ElectricBoltIcon className='text-[.75vw] mr-1' />
                                <span className='text-center'>ออกแผน</span>
                            </Stack>
                        </div>
                    </div>
                    <div className='flex w-full h-full box-content'>
                        <div className={`h-[93%] w-full text-center pl-6`}>
                            {
                                loading ? <div className='flex flex-col justify-center items-center h-full loading'><CircularProgress style={{ color: '#4effca' }} /><span className=' mt-3'>กำลังโหลดข้อมูล . . .</span></div> : <>
                                    {
                                        msgNoData ? <div className=' h-full flex items-center justify-center'>ไม่พบข้อมูลการผลิต . . . </div> : <TableVirtuoso
                                            id='tbDo'
                                            data={parts}
                                            components={VirtuosoTableComponents}
                                            fixedHeaderContent={fixedHeaderContent}
                                            itemContent={(index, part) => (
                                                <TableCell key={index} colSpan={63} className='p-0 cursor-pointer' style={{ borderBottomWidth: 0 }}>
                                                    <Paper elevation={2} className='bg-transparent'>
                                                        <Table id="tbContent" className='w-auto' sx={{
                                                            [`& .${tableCellClasses.root}`]: {
                                                                borderBottom: "none"
                                                            }
                                                        }}>
                                                            <TableBody>
                                                                <TableRow className={`text-[${themeSys ? themeNight.color : themeLight.color}]`}>
                                                                    <TableCell className='tdTitle stuck text-center align-top text-[1rem] font-bold p-0 w-[400px] ' colSpan={2} rowSpan={10}>
                                                                        <Table className='w-[400px] tbTitle '>
                                                                            <TableBody>
                                                                                <TableRow>
                                                                                    <TableCell rowSpan={10} className='pl-1 pr-1 py-1 align-top border-none'>
                                                                                        <Stack direction='column' gap={1}>
                                                                                            <div className='partDetail select-none'>
                                                                                                <Stack>
                                                                                                    <Typography className='partVal'>{part} {master[part]?.partCm} <span className='unitVal'>{master[part]?.partUnit}</span></Typography>
                                                                                                    <Typography className='text-[12px]'>{(master[part]?.partDesc != '' && typeof master[part]?.partDesc != 'undefined') ? ('(' + master[part]?.partDesc + ')') : '-'}</Typography>
                                                                                                    <div className='flex items-center gap-1'>
                                                                                                        <span><AirportShuttleIcon className='sm:text-[.95vw] md:text-[.75vw]' /></span>
                                                                                                        <span> PD.LT : </span>
                                                                                                        <span className='boxVal'>{master[part]?.vdProdLeadtime}</span>
                                                                                                        <span><WidgetsIcon className='sm:text-[.95vw] md:text-[.75vw]' /></span>
                                                                                                        <span> BOX : </span>
                                                                                                        <span className='boxVal'>{master[part]?.partQtyBox}</span>
                                                                                                    </div>
                                                                                                    <div className='flex items-center gap-1'>
                                                                                                        <span><KeyboardDoubleArrowDownIcon className='sm:text-[1.25vw] md:text-[1vw]' /></span>
                                                                                                        <span> MIN : </span>
                                                                                                        <span className='minVal'>{master[part]?.vdMinDelivery}</span>
                                                                                                        <span><KeyboardDoubleArrowUpIcon className='sm:text-[1.25vw] md:text-[1vw]' /></span>
                                                                                                        <span> MAX : </span>
                                                                                                        <span className='maxVal'>{master[part]?.vdMaxDelivery != 99999 ? master[part]?.vdMaxDelivery : '-'}</span>
                                                                                                    </div>
                                                                                                </Stack>
                                                                                            </div>
                                                                                        </Stack>
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                                {
                                                                                    reducer.titles.map((item, index) => {
                                                                                        return item.checked && <TableRow key={index}>
                                                                                            <TableCell className='stuck px-0 h-[40px] p-0 text-[#dddddd] w-[200px] border-0'>
                                                                                                <div className='flex items-center gap-2 pl-2'>
                                                                                                    <span className={`title ${item.name}`}>{item.label}</span>
                                                                                                </div>
                                                                                            </TableCell>
                                                                                        </TableRow>
                                                                                    })
                                                                                }
                                                                            </TableBody>
                                                                        </Table>
                                                                    </TableCell>
                                                                </TableRow>
                                                                {
                                                                    reducer.titles[0].checked && <TableRow>
                                                                        <ItemCell dataSet={plan[part]} keyShow='plan' _class=' planVal' endDate={endDate}></ItemCell>
                                                                    </TableRow>
                                                                }
                                                                {
                                                                    reducer.titles[1].checked && <TableRow>
                                                                        <ItemCell dataSet={plan[part]} keyShow='picklist' textColor='text-red-400' _class='pickListVal' endDate={endDate}></ItemCell>
                                                                    </TableRow>
                                                                }
                                                                {
                                                                    reducer.titles[2].checked && <TableRow>
                                                                        <ItemCell dataSet={plan[part]} keyShow='ProdUse' _class='prodUseVal' textColor='' endDate={endDate}></ItemCell>
                                                                    </TableRow>
                                                                }
                                                                {
                                                                    reducer.titles[3].checked && <TableRow>
                                                                        <ItemCell dataSet={plan[part]} keyShow='doPlan' _class='doPlanVal' endDate={endDate} master={master} holiday = {holiday} part={part}></ItemCell>
                                                                    </TableRow>
                                                                }
                                                                {
                                                                    reducer.titles[4].checked && <TableRow>
                                                                        <ItemCell dataSet={plan[part]} keyShow='doAct' _class='doActVal' textColor='text-teal-300' endDate={endDate}></ItemCell>
                                                                    </TableRow>
                                                                }
                                                                {
                                                                    reducer.titles[5].checked && <TableRow>
                                                                        <ItemCell dataSet={plan[part]} keyShow='doBalance' _class='wipVal' textColor='' endDate={endDate}></ItemCell>
                                                                    </TableRow>
                                                                }
                                                                {
                                                                    reducer.titles[6].checked && <TableRow>
                                                                        <ItemCell dataSet={plan[part]} keyShow='stock' _class='stockVal' textColor='text-orange-400' endDate={endDate}></ItemCell>
                                                                    </TableRow>
                                                                }
                                                                {
                                                                    reducer.titles[7].checked && <TableRow>
                                                                        <ItemCell dataSet={plan[part]} keyShow='stockSim' _class='stockSimVal' endDate={endDate}></ItemCell>
                                                                    </TableRow>
                                                                }
                                                                {
                                                                    reducer.titles[8].checked && <TableRow>
                                                                        <ItemCell dataSet={plan[part]} keyShow='po' _class='poVal' endDate={endDate}></ItemCell>
                                                                    </TableRow>
                                                                }
                                                                <TableRow>
                                                                    <TableCell colSpan={63} className='p-0 divider'>&nbsp;</TableCell>
                                                                </TableRow>

                                                            </TableBody>
                                                        </Table>
                                                    </Paper>
                                                </TableCell>
                                            )}
                                        />
                                    }

                                </>
                            }
                        </div >
                    </div>
                    <Dialog open={openApprDo} >
                        <DialogTitle id="alert-dialog-title">
                            {"คุณต้องการออกแผน Delivery Order ใช่หรือไม่ ?"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                กรุณาตรวจสอบข้อมูลของระบบที่แสดงให้คุณเห็น หากมั่นใจและต้องการออกแผน Delivery Order สามารถกดปุ่ม ยืนยัน
                            </DialogContentText>
                            {
                                loadingApprDo && <div className='flex items-center justify-start flex-col gap-2 py-[16px]'>{
                                    msgWaitApprDo == "กรุณารอสักครู่ . . ." ? <CircularProgress /> : (msgWaitApprDo == "สร้างแผน Delivery Order สำเร็จแล้ว" ? <CheckCircleRoundedIcon color={'success'} sx={{ fontSize: 100 }} /> : <CancelRoundedIcon sx={{ fontSize: 100, color: red[500] }} />)
                                }<span>{msgWaitApprDo}</span></div>
                            }
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseApprDo} disabled={disabledBtnApprDo && 'disabled'}>ปิดหน้าต่าง</Button>
                            {
                                showBtnRunDo && <Button onClick={confirmApprDo} autoFocus variant='contained' disabled={disabledBtnApprDo && 'disabled'}>
                                    ยืนยัน
                                </Button>
                            }
                        </DialogActions>
                    </Dialog>
                    <Dialog open={openFilter} fullWidth maxWidth={'sm'}>
                        <DialogTitle>Filter Choice</DialogTitle>
                        <DialogContent dividers>
                            <CheckBoxFilter />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenFilter(false)} variant='contained' color='inherit'>Close</Button>
                            {/* <Button onClick={() => setOpenFilter(false)} variant='contained'><FilterAltOutlinedIcon />&nbsp;Filter</Button> */}
                        </DialogActions>
                    </Dialog>

                    <Dialog open={openViewDetailDrawing} onClose={() => setOpenViewDetailDrawing(false)} fullWidth maxWidth={'sm'}>
                        <DialogTitle>Drawing Standard</DialogTitle>
                        <DialogContent dividers>
                            <Grid container spacing={2}>
                                <Grid item xs={6} >
                                    <Stack>
                                        <FormLabel>Code</FormLabel>
                                        <TextField hiddenLabel variant='filled' size='small' inputProps={{ readOnly: true }} focused value={drawingDetail.partNo + ' ' + drawingDetail.partCm} />
                                    </Stack>
                                </Grid>
                                <Grid item xs={6} >
                                    <Stack>
                                        <FormLabel>Description</FormLabel>
                                        <TextField hiddenLabel variant='filled' size='small' inputProps={{ readOnly: true }} focused value={drawingDetail.partDesc} />
                                    </Stack>
                                </Grid>
                                <Grid item xs={6} >
                                    <Stack>
                                        <FormLabel>Box</FormLabel>
                                        <TextField type='number' hiddenLabel variant='filled' size='small' inputProps={{ readOnly: true }} focused value={drawingDetail.partQtyBox} />
                                    </Stack>
                                </Grid>
                                <Grid item xs={6} >
                                    <Stack>
                                        <FormLabel>Production LeadTime</FormLabel>
                                        <TextField type='number' hiddenLabel variant='filled' size='small' inputProps={{ readOnly: true }} focused value={drawingDetail.vdProdLeadtime} />
                                    </Stack>
                                </Grid>
                                <Grid item xs={6} >
                                    <Stack>
                                        <FormLabel> Minimum Delivery</FormLabel>
                                        <TextField type='number' hiddenLabel variant='filled' size='small' inputProps={{ readOnly: true }} focused value={drawingDetail.vdMinDelivery} />
                                    </Stack>
                                </Grid>
                                <Grid item xs={6} >
                                    <Stack>
                                        <FormLabel> Maximum Delivery</FormLabel>
                                        <TextField type='number' hiddenLabel variant='filled' size='small' inputProps={{ readOnly: true }} focused value={drawingDetail.vdMaxDelivery != '99999' ? drawingDetail.vdMaxDelivery : '-'} />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <FormLabel className='flex'><CalendarMonthIcon />&nbsp;Delivery Calendar </FormLabel>
                                        <TableContainer component={Paper}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        {
                                                            reducer.dayOfWeek.map((day, index) => (
                                                                <TableCell key={index}>
                                                                    {
                                                                        day
                                                                    }
                                                                </TableCell>
                                                            ))
                                                        }
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    <TableRow>
                                                        {
                                                            Object.keys(drawingDetail).length && reducer.dayOfWeek.map((day, index) => (
                                                                <TableCell key={index}>
                                                                    {
                                                                        master[drawingDetail.partNo]["vd" + day] == true ? <CheckCircleOutlineIcon color='success' /> : <HighlightOffIcon color='error' />
                                                                    }
                                                                </TableCell>
                                                            ))
                                                        }
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenViewDetailDrawing(false)} variant='outlined'>Close</Button>
                        </DialogActions>
                    </Dialog>
                </div > : <LoginPage />
            }
        </>
    )
}

export default PlanPage
