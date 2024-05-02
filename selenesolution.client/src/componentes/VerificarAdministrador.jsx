/* eslint-disable react/prop-types */
import { useContext } from "react"
import { UserContext } from "../context/UserProvider"
import { Navigate } from "react-router-dom"


const VerficarAdministrador = ({children}) => {

    const { user } = useContext(UserContext)

    const data = JSON.parse(user)

    if (user == null) {
        return <Navigate to="/Login" />
    }
    else if (data.idRolNavigation.descripcion != "Administrador") {
        return <Navigate to="/" />
    }
    return children
}

export default VerficarAdministrador