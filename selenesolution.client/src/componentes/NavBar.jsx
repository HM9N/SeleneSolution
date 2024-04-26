/* eslint-disable no-unused-vars */
import React, { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { UserContext } from '../context/UserProvider';

const modelo = {
    nombre: "",
    correo: "",
    idRolNavigation: {
        idRol:0,
        descripcion: ""
    }
}
const NavBar = () => {

    const { user} = useContext(UserContext);

    const [dataUser, setDataUser] = useState(modelo)

    useEffect(() => {
        let dt = JSON.parse(user)
        setDataUser(dt)

    }, [])
    return (
        
        <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

            <Link className="sidebar-brand d-flex align-items-center justify-content-center" to="/">
                <div className="sidebar-brand-icon">
                    <i className="fas fa-store"></i>
                </div>
                <div className="sidebar-brand-text mx-3">Tienda Selene</div>
            </Link>


            <hr className="sidebar-divider my-0" />
           

            <hr className="sidebar-divider" />
            
            {
                (dataUser.idRolNavigation.descripcion == "Administrador") &&
                <li className="nav-item">
                    <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseProductos"
                        aria-expanded="true" aria-controls="collapseProductos">
                        <i className="fas fa-stream"></i>
                        <span>Manejo de productos</span>
                    </a>
                    <div id="collapseProductos" className="collapse" aria-labelledby="headingUtilities"
                        data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <NavLink to="/producto" className="collapse-item">Productos</NavLink>
                            <NavLink to="/proveedor" className="collapse-item">Proveedores</NavLink>
                        </div>
                    </div>
                </li>
            }

            {
                (dataUser.idRolNavigation.descripcion == "Administrador") &&
                <li className="nav-item">
                    <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseActividad"
                        aria-expanded="true" aria-controls="collapseActvidad">
                        <i className="fas fa-chart-bar"></i>
                        <span>Actividad</span>
                    </a>
                    <div id="collapseActividad" className="collapse" aria-labelledby="headingUtilities"
                        data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <NavLink to="/actividadvendedores" className="collapse-item">Vendedores</NavLink>
                            <NavLink to="/actividadproductos" className="collapse-item">Productos</NavLink>
                        </div>
                    </div>
                </li>
            }
           

            <li className="nav-item">
                <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseVenta"
                    aria-expanded="true" aria-controls="collapseVenta">
                    <i className="fas fa-fw fa-tag"></i>
                    <span>Ventas</span>
                </a>
                <div id="collapseVenta" className="collapse" aria-labelledby="headingUtilities"
                    data-parent="#accordionSidebar">
                    <div className="bg-white py-2 collapse-inner rounded">
                        <NavLink to="/venta" className="collapse-item">Nueva Venta</NavLink>
                        <NavLink to="/historialventa" className="collapse-item">Historial Venta</NavLink>
                    </div>
                </div>
            </li>
            


            <hr className="sidebar-divider d-none d-md-block" />

            <div className="text-center d-none d-md-inline">
                <button className="rounded-circle border-0" id="sidebarToggle"></button>
            </div>

        </ul>
        )
}

export default NavBar;