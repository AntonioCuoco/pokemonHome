import { useSelector } from 'react-redux'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { generateSecureKey } from '../utils/utils'

const ProtectedRoutes = () => {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const autenticationKey = sessionStorage.getItem('authenticationKey');

    if(isLoggedIn || autenticationKey
    ) {
        return <Outlet />
    } else {
        return <Navigate to={'/login'}/>
    }
}

export default ProtectedRoutes;