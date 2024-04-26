namespace SeleneSolution.Server.Models.DTO
{
    public class DtoProducto
    {
        public int? IdProducto { get; set; }
        public required string Codigo { get; set; }
        public string? Nombre { get; set; }
        public decimal Valor { get; set; }
        public DateTime FechaCreacion { get; set; }
        public int NitProveedor { get; set; }

        public int Cantidad { get; set; }

        public decimal Total { get; set; }
    }

}
