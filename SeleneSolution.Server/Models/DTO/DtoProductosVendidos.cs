namespace SeleneSolution.Server.Models.DTO
{
    public class DtoProductosVendidos
    {
        public required string CodigoProducto { get; set; }
        public string? NombreProducto { get; set; }
        public int? CantidadVendida { get; set; }

    }
}
