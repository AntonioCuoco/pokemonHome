import React from "react";
import { Input } from 'antd';
import './Input.css'

export default function InputCustom({ placeholder, handleInput,value,type }) {
    return (
        <Input onChange={handleInput} className="input-field" placeholder={placeholder} value={value} type={type}/>
    );
}