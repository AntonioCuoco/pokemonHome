import React, { useState } from 'react';
import axios from 'axios';
import { isNil, isNilAndLengthMinusSix,generateSecureKey, isNilOnly } from '../../utils/utils';
import { useNavigate } from 'react-router-dom';
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";
import { Form, Input } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, googleAuthProvider } from '../../firebase/firebase'
import { useDispatch } from 'react-redux';
import { setEmail, setLoggedIn, setName, setPhotoUrl, setSurname } from '../../redux/slice/authSlice';
import "./loginPage.css"

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = useForm();

  const handleLogin = async (e) => {

    console.log(e);

    const email = e.email;
    const password = e.password;

    if (isNil(email) && isNilAndLengthMinusSix(password)) {
      return alert("inserisci email o password");
    }

    const message = await axios.post('http://localhost:3000/login', {
      email: email,
      password: password
    });

    form.resetFields();

    dispatch(setLoggedIn());
    const autenticationKey = generateSecureKey();
    sessionStorage.setItem('authenticationKey', autenticationKey);
    dispatch(setName(message.data.name));
    dispatch(setEmail(message.data.email));
    if(!isNil(message.data.photoUrl)) {
      dispatch(setPhotoUrl(message.data.photoUrl));
    }
    sessionStorage.setItem('name', message.data.name);
    sessionStorage.setItem('email',message.data.email);
    if(!isNil(message.data.photoUrl)) {
      sessionStorage.setItem('photoUrl',message.data.photoUrl);
    }

    navigate('/');
  };

  const signInWithGoogle = async () => {
    signInWithPopup(auth, googleAuthProvider)
      .then(async(result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result._tokenResponse;
        const userKey = generateSecureKey();

        const googleUser = {
          name: user.firstName,
          surname: user.lastName,
          email: user.email,
          photo: user.photoUrl,
          userKey: userKey
        }

        dispatch(setName(user.firstName));
        // dispatch(setSurname(user.lastName));
        dispatch(setPhotoUrl(user.photoUrl));
        dispatch(setEmail(user.email));

        sessionStorage.setItem('name',user.firstName);
        sessionStorage.setItem('email',user.email);
        sessionStorage.setItem('photoUrl',user.photoUrl);

        const resultCode = await axios.post('http://localhost:3000/saveGoogleUser', googleUser);

        dispatch(setLoggedIn());
        const autenticationKey = generateSecureKey();
        sessionStorage.setItem('authenticationKey',autenticationKey);
        navigate('/');
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        dispatch(setLoggedIn());
        const autenticationKey = generateSecureKey();
        sessionStorage.setItem('authenticationKey',autenticationKey);
        if(error.response.status === 409 && error.response.data.message === 'Google User already exists') {
          return navigate('/');
        }
        const credential = GoogleAuthProvider.credentialFromError(error);
        alert('code' + errorCode + 'message:' + errorMessage);
      });
  }

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to Pokehome
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Login to pokehome if you have just an account or register if you don't have it
      </p>

      <Form className="my-8" onFinish={(e) => handleLogin(e)} form={form}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
        </div>
        <Form.Item
          label="Email"
          name="email"
          className="flex flex-col space-y-2 w-full mb-4"
          rules={[
            {
              required: true,
              message: 'Please input your email!',
            },
          ]}
        >
          <Input id="email" placeholder="projectmayhem@fc.com" type="email" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          className="flex flex-col space-y-2 w-full mb-4"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password placeholder="••••••••" id="password" />
        </Form.Item>
        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Login &rarr;
          <BottomGradient />
        </button>
        <p onClick={() => navigate('/register')} style={{ textAlign: 'center', marginTop: 12 }}>Register</p>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
      </Form>
      <div className="flex flex-col space-y-4">
        {/*<button
          className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
          type="submit"
        >
          <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
          <span className="text-neutral-700 dark:text-neutral-300 text-sm">
            GitHub
          </span>
          <BottomGradient />
        </button>*/}
        <button
          className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
          type="submit"
          onClick={async () => await signInWithGoogle()}
        >
          <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
          <span className="text-neutral-700 dark:text-neutral-300 text-sm">
            Google
          </span>
          <BottomGradient />
        </button>
        {/* <button
          className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
          type="submit"
        >
          <IconBrandOnlyfans className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
          <span className="text-neutral-700 dark:text-neutral-300 text-sm">
            OnlyFans
          </span>
          <BottomGradient />
        </button> */}
      </div>
    </div>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

export default LoginPage;