import { Button, CircularProgress, Stack, TextField } from '@mui/material'
import axios from 'axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import bodyImage from '../images/body-image.jpg';
import { BoxInput } from '../styles/LoginStyled';
function LoginPage() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const [loginState, setLoginState] = useState(false);
    const [LoginFalse, setLoginFalse] = useState(false);
    const onSubmit = data => {
        // setLoginState(true);
        axios({
            method: 'get',
            url: 'http://websrv01.dci.daikin.co.jp/BudgetCharts/BudgetRestService/api/authen?username=' + data.username + '&password=' + encodeURIComponent(data.password),
            withCredentials: false,
        }).then((res) => {
            if (res.data[0]['EmpCode'] != null) {
                dispatch({ type: 'INIT_LOGIN', payload: { login: true, id: res.data[0]['EmpCode'], name: res.data[0]['ShortName'] } });
            } else {
                setLoginFalse(true);
            }
        }).catch((error) => {
        })
    }
    return (
        <form className='flex h-full' onSubmit={handleSubmit(onSubmit)}>
            <div className='flex h-full w-full justify-center' style={{
                backgroundImage: `url(${bodyImage})`,
            }}>
                {
                    !loginState ? (
                        <BoxInput>
                            <div className='h-[50%] flex justify-center items-center'>
                                <span className='text-center text-[3rem] sm:text-[3rem] md:text-[3.5rem]  transition-all duration-1000 font-600'>DELIVERY ORDER</span>
                            </div>
                            <div className=' h-[70%] flex-col items-center justify-center  transition-all duration-1000'>
                                <h1 className='font-bold text-center'>LOGIN</h1>
                                <input type="text" placeholder="Username" className='px-3 py-2 border-gray-300 border-2 border-solid rounded-md w-full mt-3' onChange={(e) => setUsername(e.target.value)} {...register('username', { required: true })} autoFocus />
                                <input type="password" placeholder="Password" className='mt-2 px-3 py-2 mb-3 border-gray-300 border-2 border-solid rounded-md w-full' onChange={(e) => setPassword(e.target.value)} {...register('password', { required: true })} />
                                {/* <input /> */}
                                {/* <button className='w-full mt-3 bg-blue-500 text-white rounded-lg px-5 py-2 uppercase' type='submit'>login</button> */}
                                <Button variant='contained' type='submit' className='w-full'>เข้าสู่ระบบ</Button>
                                {
                                    LoginFalse && <div className='flex items-center justify-center p-3'>ไม่สามารถเข้าสู่ระบบได้ ...</div>
                                }
                            </div>
                            <span className=' h-auto text-center pb-3'>2023 DCI, All right Reserved</span>
                        </BoxInput>
                    ) : (
                        <div className='h-full flex justify-center items-center flex-col gap-3'>
                            <CircularProgress />
                            <p>กำลังเข้าสู่ระบบ . . . </p>
                        </div>
                    )
                }
            </div>
        </form>
    )
}

export default LoginPage