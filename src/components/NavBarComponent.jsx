import React from 'react'
import { Box, CircularProgress, Divider, Table, TableBody, TableCell, TableContainer, TableRow, TableHead, Paper, Button, Select, Stack, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Avatar, IconButton, InputBase, Typography, FormGroup, FormControlLabel, Checkbox, FormLabel, Grid, TextField } from '@mui/material'
import GridViewIcon from '@mui/icons-material/GridView';
import { useState } from 'react';
function NavBarComponent() {
    var menu = ['D/O PLAN', 'SUPPLIER', 'STOCK', 'PO'];
    const [idActive, setIdActive] = useState(0);
    return (
        <div className='flex items-center flex-col md:w-[10%] lg:w-[8%] xl:w-[7.5%] 2xl:w-[6%] md:text-[1vw] lg:text-[1vw] xl:text-[.75vw] bg-[#37393c] text-[#ececec]  gap-[8px] pt-[8px] pl-[8px] pr-[8px] select-none'>
            <Divider className='bg-[#4effca] border-2 w-[65%] rounded-lg mb-2'/>
            {
                menu.map((item, key) => (
                    <div key={key} className={`${idActive == key ? 'bg-[#4effca] text-[#080b0f]' : 'bg-[#212327]'} w-full rounded-[8px]  px-[8px] py-[8px] cursor-pointer transition ease-in-out delay-50  hover:-translate-y-1 hover:scale-105 hover:bg-[#4effca] hover:text-[#080b0f] duration-300 shadow-mtr`} onClick={() => setIdActive(key)}>
                        <Stack alignItems={'center'}>
                            <GridViewIcon />
                            <span className='text-center'>{item}</span>
                        </Stack>
                    </div>
                ))
            }
        </div>
    )
}

export default NavBarComponent