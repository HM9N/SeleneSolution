import { useState } from "react";
import { useContext, useEffect } from "react";
import {Row, Col } from "reactstrap";
import { UserContext } from "../context/UserProvider";

const modelo = {
    nombre: "",
    correo: "",
    idRolNavigation: {
        descripcion :""
    }
}

const Inicio = () => {

    const { user } = useContext(UserContext)
    const [ dataUser, setDataUser ] = useState(modelo)

    useEffect(() => {
        let dt = JSON.parse(user)
        setDataUser(dt)

    }, [])

    return (
        <>
            <Row>
                <Col sm={12} className="text-left">
                    <h2>Bienvenido al sistema, {dataUser.nombre}</h2>
                </Col>
            </Row>
            <Row>
                <Col sm={3}>
                    <div className="card">
                        <img className="card-img-top" src={"public/imagen/seleneimagen.png"} alt="Card image cap" />
                    </div>
                </Col>
            </Row>
        </>
       
        )
}

export default Inicio;