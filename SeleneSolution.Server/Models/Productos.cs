using System;
using System.Collections.Generic;

namespace SeleneSolution.Server.Models;

public partial class Productos
{
    public int IdProducto { get; set; }

    public string? Codigo { get; set; }

    public string? Nombre { get; set; }

    public decimal? Valor { get; set; }

    public DateOnly? FechaCreacion { get; set; }

    public int? NitProveedor { get; set; }

    public string? Foto { get; set; }

    public virtual ICollection<DetalleVentas> DetalleVentas { get; set; } = new List<DetalleVentas>();

    public virtual Proveedores? NitProveedorNavigation { get; set; }
}
