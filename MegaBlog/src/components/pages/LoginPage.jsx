import React, { useEffect } from 'react'
import Login from '../Login'
 

const LoginPage = () => {
  useEffect(() => {
    document.title = "Login - MegaBlog";
  }, []);
  return (
    <div className=''>
        <Login/>
    </div>
  )
}

export default LoginPage