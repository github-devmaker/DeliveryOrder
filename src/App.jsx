import React, { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Box, Divider, Table, TableBody, TableCell, TableContainer, TableRow, TableHead, Paper, Button } from '@mui/material'
import Toolbar from './components/Toolbar'
import { TableVirtuoso } from 'react-virtuoso'
import { ServiceGetPlan } from './Services'
import moment from 'moment/moment'
import AbcIcon from '@mui/icons-material/Abc';
function App() {
  const [count, setCount] = useState(0);
  const [plan, setPlan] = useState([]);
  const [parts, setParts] = useState([]);
  const [Today, setToday] = useState();
  const [columns, setColumns] = useState([]);
  const [planDefault, setPlanDefault] = useState([]);
  const currentDate = moment().format('YYYY-MM-DD');
  var ranonce = false;
  useEffect(() => {
    if (!ranonce) {
      GetPlan();
      SetColDay();
      ranonce = true;
    }
  }, []);
  function GetPlan() {
    ServiceGetPlan().then((res) => {
      console.log(res.data)
      var newPlan = [];
      var planDate = [];
      setPlanDefault(res.data);
      res.data.map((item, index) => {
        if (typeof newPlan[item.partNo] == 'undefined') {
          newPlan[item.partNo] = []
        }
        newPlan[item.partNo].push(item);
      });
      setPlan(newPlan);
      setParts(Object.keys(newPlan));
    });
  }
  function SetColDay() {
    var sDate = moment('2023-06-01', 'YYYY-MM-DD');
    var fDate = moment('2023-07-31', 'YYYY-MM-DD');
    var column = [{
      label: 'DRAWING NO.',
      dataKey: 'DRAWING NO.',
      width: 150,
      numeric: false
    }, {
      label: moment(sDate).format('MMM').toUpperCase(),
      dataKey: moment(sDate).format('MMM').toUpperCase(),
      width: 200,
      numeric: false
    }];
    while (!sDate.isSame(fDate)) {
      column.push({
        label: sDate.format('YYYY-MM-DD'),
        dataKey: sDate.format('YYYY-MM-DD'),
        width: 75,
        height: 40,
        type: 'day',
        numeric: false
      });
      sDate.add(1, 'day');
    }
    column.push({
      label: sDate.format('YYYY-MM-DD'),
      dataKey: sDate.format('YYYY-MM-DD'),
      width: 75,
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
          {columns.map((column, i) => (
            <TableCell
              className={isHoliday(column.label) + ' ' + styleDay(column)}
              key={i}
              variant="head"
              align={column.numeric || false ? 'center' : 'center'}
              style={{ width: column.width, padding: 0, height: column.height }}
            >
              {
                moment(column.label).format('ddd')
              }
            </TableCell>
          ))
          }
        </TableRow >
        <TableRow>
          {columns.map((column, i) => (
            <TableCell
              className={isHoliday(column.label)}
              key={i}
              variant="head"
              align={column.numeric || false ? 'center' : 'center'}
              style={{ width: column.width, padding: 0, height: column.height }}
            >
              {
                moment(column.label).format('D')
              }
            </TableCell>
          ))
          }
        </TableRow ></>
    );
  }
  function isHoliday(days) {
    return moment(days, 'YYYY-MM-DD').format('ddd');
  }
  function styleDay(column) {
    var diff = moment(column.dataKey).diff(moment().format('YYYY-MM-DD'), 'days');
    if (diff == 0) {
      setToday(column.label);
      return 'today';
    } else if (diff > 0 && diff <= 6) {
      return 'fix';
    } else if (diff > 6 && diff <= 14) {
      return 'do';
    } else {
      return column.label;
    }
  }
  const VirtuosoTableComponents = {
    Scroller: React.forwardRef((props, ref) => (
      <TableContainer component={Paper} {...props} ref={ref} />
    )),
    Table: (props) => (
      <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
    ),
    TableHead,
    TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
    TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
  }
  return (
    <>
      <div className='flex items-center h-[75px] px-[2rem]'>
        <div className='text-white text-3xl'>DELIVERY ORDER</div>
      </div>
      <Divider className='border-[#ffffff0a]' style={{ borderColor: '#ffffff26' }} light={true} />
      <div className='h-[75px] flex justify-between items-center px-6'>
        FILTER
        <Button variant='contained'>APPROVE</Button>
      </div>
      <Divider className='border-[#ffffff0a]' style={{ borderColor: '#ffffff26' }} light={true} />
      <div className='h-[800px]'>
        <TableVirtuoso
          id='tbDo'
          style={{ backgroundColor: '#202026' }}
          data={parts}
          components={VirtuosoTableComponents}
          fixedHeaderContent={fixedHeaderContent}
          itemContent={(index, part) => {
            return <TableCell key={index} colSpan={63} className='p-0' style={{ borderBottomWidth: 0 }}>
              <Table id="tbContent">
                <TableBody>
                  <TableRow>
                    <TableCell className='stuck align-top text-white text-[1rem] font-bold px-1 py-1' rowSpan={10} style={{ width: '117px' }}>
                      {part}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className='stuck px-0 py-1 text-[#dddddd]' style={{ width: '150px' }}>
                      <div className='flex items-center gap-2'>
                        <span className='doTitle  bg-blue-500'></span>
                        <span className='leading-8'>Prod Plan (Plan * BOM)</span>
                      </div>
                    </TableCell>
                    {
                      plan[part].map((val) => (
                        <TableCell className={`text-xl text-gray-300 p-0 w-[50px] h-[50px] ${isHoliday(val.datePlan)}`} align='center'>
                          {
                            val.plan > 0 ? <span className={'text-blue-400 Sat'}>{val.plan}</span> : <span className='dot'></span>
                          }
                        </TableCell>
                      ))
                    }
                  </TableRow>
                  <TableRow>
                    <TableCell className='stuck px-0 py-1 text-[#dddddd] w-[50px] h-[50px]' style={{ width: '150px' }}>
                      <div className='flex items-center gap-2'>
                        <span className='doTitle  bg-red-500'></span>
                        <span className='leading-8'>PickList</span>
                      </div>
                    </TableCell>
                    {
                      plan[part].map((val, index) => (
                        <TableCell className={`text-xl text-gray-300 p-0 w-[50px] h-[50px] ${isHoliday(val.datePlan)}`} align='center'>
                          {
                            val.pickList > 0 ? <span className='text-red-400'>{val.pickList}</span> : <span className='dot'></span>
                          }
                        </TableCell>
                      ))
                    }
                  </TableRow>
                  <TableRow>
                    <TableCell className='stuck px-0 py-1 text-[#dddddd] w-[50px] h-[50px]' style={{ width: '150px' }}>
                      <div className='flex items-center gap-2'>
                        <span className='doTitle  bg-orange-500'></span>
                        <span className='leading-8'>Prod Use</span>
                      </div>
                    </TableCell>
                    {
                      plan[part].map((val, index) => (
                        <TableCell className={`text-xl text-gray-300 p-0 w-[50px] h-[50px] ${isHoliday(val.datePlan)}`} align='center'>
                          {
                            0 > 0 ? <span className='text-black'>{0}</span> : <span className='dot'></span>
                          }
                        </TableCell>
                      ))
                    }
                  </TableRow>
                  <TableRow>
                    <TableCell className='stuck px-0 py-1 text-[#dddddd] w-[50px] h-[50px]' style={{ width: '150px' }}>
                      <div className='flex items-center gap-2'>
                        <span className='doTitle  bg-green-500'></span>
                        <span className='leading-8'>D/O Plan</span>
                      </div>
                    </TableCell>
                    {
                      plan[part].map((val, index) => (
                        <TableCell className={`text-xl text-gray-300 p-0 w-[50px] h-[50px] ${isHoliday(val.datePlan)}`} align='center'>
                          {
                            val.doPlan > 0 ? <>
                              <span className='text-green-400'>{val.doPlan}</span>
                            </> : <span className='dot'></span>
                          }
                        </TableCell>
                      ))
                    }
                  </TableRow>
                  <TableRow>
                    <TableCell className='stuck px-0 py-1 text-[#dddddd] w-[50px] h-[50px]' style={{ width: '150px' }}>
                      <div className='flex items-center gap-2'>
                        <span className='doTitle  bg-teal-400'></span>
                        <span className='leading-8'>D/O Act.</span>
                      </div>
                    </TableCell>
                    {
                      plan[part].map((val, index) => (
                        // <BoxValue index={index} val={val.doAct} textColor={'green-500'} bgColor={'#6bc46af0'} />
                        <TableCell className={`text-xl text-gray-300 p-0 w-[50px] h-[50px] ${isHoliday(val.datePlan)}`} align='center'>
                          {
                            val.doAct > 0 ? <span className=' text-teal-400'>{val.doAct}</span> : <span className='dot'></span>
                          }
                        </TableCell>
                      ))
                    }
                  </TableRow>
                  <TableRow>
                    <TableCell className='stuck px-0 py-1 text-[#dddddd] w-[50px] h-[50px]' style={{ width: '150px' }}>
                      <div className='flex items-center gap-2'>
                        <span className='doTitle  bg-gray-400'></span>
                        <span className='leading-8'>WIP</span>
                      </div>
                    </TableCell>
                    {
                      plan[part].map((val, index) => (
                        <TableCell className={`text-xl text-gray-300 p-0 w-[50px] h-[50px] ${isHoliday(val.datePlan)}`} align='center'>
                          {
                            0 > 0 ? <span className=' text-black'>{0}</span> : <span className='dot'></span>
                          }
                        </TableCell>
                      ))
                    }
                  </TableRow>
                  <TableRow>
                    <TableCell className='stuck px-0 py-1 text-[#dddddd] w-[50px] h-[50px]' style={{ width: '150px' }}>
                      <div className='flex items-center gap-2'>
                        <span className='doTitle  bg-blue-600'></span>
                        <span className='leading-8'>P/S Stock</span>
                      </div>
                    </TableCell>
                    {
                      plan[part].map((val) => (
                        <TableCell className={`text-xl text-gray-300 p-0 w-[50px] h-[50px] ${isHoliday(val.datePlan)}`} align='center'>
                          {
                            val.stock > 0 ? <span className='text-blue-400'>{val.stock}</span> : <span className='dot'></span>
                          }
                        </TableCell>
                      ))
                    }
                  </TableRow>
                  <TableRow>
                    <TableCell className='stuck px-0 py-1 text-[#dddddd] w-[50px] h-[50px]' style={{ width: '150px' }}>
                      <div className='flex items-center gap-2'>
                        <span className='doTitle  bg-blue-600'></span>
                        <span className='leading-8'>P/S Stock (Simulate)</span>
                      </div>
                    </TableCell>
                    {
                      plan[part].map((val, index) => (
                        <TableCell className={`text-xl text-gray-300 p-0 w-[50px] h-[50px] ${isHoliday(val.datePlan)}`} align='center'>
                          {
                            val.stockSimulate > 0 ? <span className='text-blue-500'>{val.stockSimulate}</span> : <span className='dot'></span>
                          }
                        </TableCell>
                      ))
                    }
                  </TableRow>
                  <TableRow>
                    <TableCell className='stuck px-0 py-1 text-[#dddddd] w-[50px] h-[50px]' style={{ width: '150px' }}>
                      <div className='flex items-center gap-2'>
                        <span className='doTitle  bg-teal-400'></span>
                        <span className='leading-8'>PO</span>
                      </div>
                    </TableCell>
                    {
                      plan[part].map((val, index) => (
                        // <BoxValue index={index} val={val.po} textColor={'black'} bgColor={'#6bc46af0'} />
                        <TableCell className={`text-xl text-gray-300 p-0 w-[50px] h-[50px] ${isHoliday(val.datePlan)}`} align='center'>
                          {
                            val.po > 0 ? <span className='text-teal-400'>{val.po}</span> : <span className='dot'></span>
                          }
                        </TableCell>
                      ))
                    }
                  </TableRow>
                </TableBody>
              </Table>
            </TableCell>
          }}
        />
      </div >
    </>
  )
}

export default App
