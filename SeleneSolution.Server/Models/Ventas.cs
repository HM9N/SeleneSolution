using System;
using System.Collections.Generic;

namespace SeleneSolution.Server.Models;

public partial class Ventas
{
    public int IdVenta { get; set; }

    public DateTime? FechaRegistro { get; set; }

    public int? IdUsuario { get; set; }

    public string? DocumentoCliente { get; set; }

    public string? NombreCliente { get; set; }

    public decimal? SubTotal { get; set; }

    public decimal? ImpuestoTotal { get; set; }

    public decimal? Total { get; set; }

    public virtual ICollection<DetalleVentas> DetalleVentas { get; set; } = new List<DetalleVentas>();

    public virtual Usuarios? IdUsuarioNavigation { get; set; }
}
