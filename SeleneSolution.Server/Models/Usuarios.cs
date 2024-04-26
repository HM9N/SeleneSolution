using System;
using System.Collections.Generic;

namespace SeleneSolution.Server.Models;

public partial class Usuarios
{
    public int IdUsuario { get; set; }

    public string? Nombre { get; set; }

    public string? Correo { get; set; }

    public string? Telefono { get; set; }

    public int? IdRol { get; set; }

    public string? Clave { get; set; }

    public bool? EsActivo { get; set; }

    public virtual Roles? IdRolNavigation { get; set; }

    public virtual ICollection<Ventas> Ventas { get; set; } = new List<Ventas>();
}
