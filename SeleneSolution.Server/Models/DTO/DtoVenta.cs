

namespace SeleneSolution.Server.Models.DTO
{
    public class DtoVenta
    {
        public int IdProducto { get; set; }
        public string? DocumentoCliente { get; set; }
        public string? NombreCliente { get; set; }
        public int IdUsuario { get; set; }
        public decimal SubTotal { get; set; }
        public decimal Impuesto { get; set; }
        public decimal Total { get; set; }

        public List<DtoProducto>? ListaProductos { get; set; }
    }
}
