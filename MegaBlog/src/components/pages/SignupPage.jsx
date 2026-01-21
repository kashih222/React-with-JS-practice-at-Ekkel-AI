import React, { useEffect } from 'react'
import Signup from "../Signup"

const SignupPage = () => {
  useEffect(() => {
    document.title = "Signup - MegaBlog";
  }, []);
  return (
    <div className=''><Signup/></div>
  )
}

export default SignupPage