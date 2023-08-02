import { Checkbox, Divider, FormControlLabel, FormGroup, Stack, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

function CheckBoxFilter() {
    const dispatch = useDispatch();
    const reducer = useSelector(state => state.mainReducer);
    const onChangeFilter = (e, name) => {
        dispatch({ type: 'CHECKED_FILTER', checked: e.checked, name: name })
    }
    return (
        <>
            {/* <Table>
                <TableBody>
                    <TableRow>
                        <TableCell rowSpan={4} className='p-0'>
                            <Stack direction={'row'} spacing={3} className='w-full'>
                                <Stack flex={1} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                    <Typography>name</Typography>
                                    <Divider orientation='vertical' />
                                </Stack>
                                <Stack flex={1} className='m-0' style={{ height: '100%' }}>
                                    {
                                        reducer.filters.map((item) => (
                                            <>
                                                <span className='p-3'>{item.name}</span>
                                                <Divider />
                                            </>
                                        ))
                                    }
                                </Stack>
                            </Stack>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell  className='p-0'>1</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell  className='p-0'>1</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell  className='p-0'>1</TableCell>
                    </TableRow>
                </TableBody>
            </Table> */}
            <FormGroup>
                {
                    reducer.titles?.map((item, index) => (
                        <FormControlLabel key={index} control={<Checkbox checked={item.checked} value={item.name} onChange={(e) => onChangeFilter(e.target, item.name)} />} label={item.label} disabled={item.disabled} />
                    ))
                }

            </FormGroup>
        </>
    )
}

export default CheckBoxFilter