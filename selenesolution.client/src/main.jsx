/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import App from './App';
import Inicio from './views/Inicio';
import NotFound from './views/NotFound';
import Usuario from './views/Usuario';
import Login from './views/Login';
import Venta from './views/Venta';
import Producto from './views/Producto';
import Proveedor from './views/Proveedor';
import ActividadVendedores from './views/ActividadVendedores';
import ActividadProductos from './views/ActividadProductos';

import UserProvider from "./context/UserProvider"
import VerificarUsuario from './componentes/VerificarUsuario';
import HistorialVenta from './views/HistorialVenta';


const root = ReactDOM.createRoot(document.getElementById("wrapper"));

root.render(
    <BrowserRouter>
        <UserProvider>
            <Routes>

                {/*ACONTINUACION ESTABLECEMOS LAS RUTAS DE NUESTRO SISTEMA*/}

                {/*ruta individual sin usar una como base*/}
                <Route index path='/Login' element={<Login />} />

                {/*Permite anidar rutas en base a una*/}
                <Route path='/' element={<App />}>

                    <Route index element={<Inicio />} />
                    <Route path='usuario' element={<VerificarUsuario> <Usuario /> </VerificarUsuario>} />
                    <Route path='venta' element={<VerificarUsuario> <Venta /> </VerificarUsuario>} />
                    <Route path='historialventa' element={<VerificarUsuario> <HistorialVenta /> </VerificarUsuario>} />
                    <Route path='producto' element={<VerificarUsuario> <Producto /> </VerificarUsuario>} />
                    <Route path='proveedor' element={<VerificarUsuario> <Proveedor /> </VerificarUsuario>} />
                    <Route path='actividadvendedores' element={<VerificarUsuario> <ActividadVendedores /> </VerificarUsuario>} />
                    <Route path='actividadproductos' element={<VerificarUsuario> <ActividadProductos /> </VerificarUsuario>} />

                </Route>
                <Route path='*' element={<NotFound />} />

            </Routes>

        </UserProvider>


    </BrowserRouter>
);

