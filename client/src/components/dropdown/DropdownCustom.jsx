import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './dropdown.css'

const DropdownCustom = () => {

    const navigate = useNavigate();

    const [refetch, setRefetch] = useState(false);

    const handleLogOut = () => {
        dispatch(setLoggedIn(false));
        sessionStorage.removeItem('authenticationKey');
        setRefetch(true);
        navigate('/');
    }

    return (
        <div className='container-dropdown'>
            <ul className='menù-dropdown'>
                <li className='li-items-dropdown' onClick={() => navigate('/profile')}>Profile</li>
                <li className='li-items-dropdown' onClick={() => handleLogOut()}>Log Out</li>
            </ul>
        </div>
    )
}

export default DropdownCustom;