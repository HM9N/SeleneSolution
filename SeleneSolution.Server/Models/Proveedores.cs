using System;
using System.Collections.Generic;

namespace SeleneSolution.Server.Models;

public partial class Proveedores
{
    public int Nit { get; set; }

    public string? Nombre { get; set; }

    public string? Ciudad { get; set; }

    public string? Telefono { get; set; }

    public string? Correo { get; set; }

    public string? Celular { get; set; }

    public virtual ICollection<Productos> Productos { get; set; } = new List<Productos>();
}
