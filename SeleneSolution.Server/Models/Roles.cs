using System;
using System.Collections.Generic;

namespace SeleneSolution.Server.Models;

public partial class Roles
{
    public int IdRol { get; set; }

    public string? Descripcion { get; set; }

    public bool? EsActivo { get; set; }

    public DateTime? FechaRegistro { get; set; }

    public virtual ICollection<Usuarios> Usuarios { get; set; } = new List<Usuarios>();
}
