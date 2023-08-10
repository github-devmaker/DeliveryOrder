import React, { useEffect } from 'react'
import { Box, CircularProgress, Divider, Table, TableBody, TableCell, TableContainer, TableRow, TableHead, Paper, Button, Select, Stack, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Avatar, IconButton, InputBase, Typography, FormGroup, FormControlLabel, Checkbox, FormLabel, Grid, TextField } from '@mui/material'
import GridViewIcon from '@mui/icons-material/GridView';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
function NavBarComponent() {
    const reducer = useSelector(state => state.mainReducer);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let PATH = import.meta.env.VITE_PATH;
    var menu = [{
        path: '/do', text: 'D/O PLAN'
    }, {
        path: '/supplier', text: 'SUPPLIER'
    }, {
        path: '/stock', text: 'STOCK'
    }, {
        path: '/po', text: 'PO'
    }];
    const openMenu = (key, path) => {
        dispatch({ type: 'NAV_MENU_SELECT', payload: key });
        navigate(path);
    }
    var once = false;
    useEffect(() => {
        if (!once) {
            if (reducer.menuIndex == '') {
                dispatch({ type: 'NAV_MENU_SELECT', payload: 0 });
                navigate(import.meta.env.VITE_PATH + menu[reducer.menuIndex].path)
            }
            once = true;
        }
    }, [])

    return (
        <div className='flex items-center flex-col md:w-[10%] lg:w-[8%] xl:w-[7.5%] 2xl:w-[6%] md:text-[1vw] lg:text-[1vw] xl:text-[.75vw] bg-[#37393c] text-[#ececec]  gap-[8px] pt-[8px] pl-[8px] pr-[8px] select-none'>
            {
                reducer.menuIndex
            }
            <Divider className='bg-[#4effca] border-2 w-[65%] rounded-lg mb-2' />
            {
                menu.map((item, key) => (
                    <div key={key} className={`${reducer.menuIndex == key ? 'bg-[#4effca] text-[#080b0f]' : 'bg-[#212327]'} w-full rounded-[8px]  px-[8px] py-[8px] cursor-pointer transition ease-in-out delay-50  hover:-translate-y-1 hover:scale-105 hover:bg-[#4effca] hover:text-[#080b0f] duration-300 shadow-mtr`} onClick={() => openMenu(key, PATH + item.path)}>
                        <Stack alignItems={'center'}>
                            <GridViewIcon />
                            <span className='text-center'>{item.text}</span>
                        </Stack>
                    </div>
                ))
            }

        </div>
    )
}

export default NavBarComponent