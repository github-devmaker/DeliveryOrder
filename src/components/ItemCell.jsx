import React from 'react'
import { Divider, RadioGroup, Table, TableBody, TableCell, TableRow } from '@mui/material'
import moment from 'moment';
import { NumericFormat } from 'react-number-format';
function ItemCell(props) {
    const { dataSet, keyShow, bgColor, textColor, endDate, _class } = props;
    function isHoliday(days) {
        return moment(days, 'YYYY-MM-DD').format('ddd');
    }
    function styleTd(date) {
        var diff = moment(date, 'YYYYMMDD').diff(moment().format('YYYY-MM-DD'), 'days');
        if (diff == 0) {
            return 'today';
        } else if (diff > 0 && diff <= 6) {
            return 'fix';
        } else if (diff > 6 && diff < 14) {
            return 'do';
        } else {
            return date;
        }
    }
    return dataSet.map((val, index) => {
        var TdStartOfMonth = "";
        if (val.date == moment(endDate).format('YYYYMM01')) {
            TdStartOfMonth = <TableCell className='w-[200px] text-[1.5rem] bg-[#1976d287]  border-0'></TableCell>
        }
        return <>
            {TdStartOfMonth}
            <TableCell key={index} className={` relative text-[1rem] text-gray-300 p-0 w-[75px] h-[30px] ${isHoliday(val.date)} ${styleTd(val.date)} ${(val[keyShow] > 0 && (styleTd(val.date) == 'fix' || styleTd(val.date) == 'do' || styleTd(val.date) == 'today')) && bgColor}`} align='center'>
                {
                    val[keyShow] > 0 ? <div>
                        <h2 className={`${keyShow == 'doPlan' ? 'aaaaa ' : ''}`}> <NumericFormat displayType='text' className={`${textColor} ${keyShow == 'doPlan' ? 'doVal ' : ''} ${_class}`} allowLeadingZeros thousandSeparator="," value={val[keyShow]} decimalScale={2} /></h2>
                    </div> : (val[keyShow] < 0 ? <NumericFormat displayType='text' className='text-red-500' thousandSeparator="," value={val[keyShow]} decimalScale={2} /> : (keyShow == 'doPlan' ? <div><h2 className={`${keyShow == 'doPlan' ? 'aaaaa ' : ''}`}></h2></div> : <span className='dot'></span>))
                }
            </TableCell>
        </>
    })
}

export default ItemCell