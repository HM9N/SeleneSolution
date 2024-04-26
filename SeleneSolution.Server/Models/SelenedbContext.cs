using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace SeleneSolution.Server.Models;

public partial class SelenedbContext : DbContext
{
    public SelenedbContext()
    {
    }

    public SelenedbContext(DbContextOptions<SelenedbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<DetalleVentas> DetalleVentas { get; set; }

    public virtual DbSet<Productos> Productos { get; set; }

    public virtual DbSet<Proveedores> Proveedores { get; set; }

    public virtual DbSet<Roles> Roles { get; set; }

    public virtual DbSet<Usuarios> Usuarios { get; set; }

    public virtual DbSet<Ventas> Ventas { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=XLAT\\SQLEXPRESS; DataBase=selenedb; Trusted_Connection=True; TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<DetalleVentas>(entity =>
        {
            entity.HasKey(e => e.IdDetalleVenta).HasName("PK__DetalleV__BFE2843F74DD78C8");

            entity.Property(e => e.IdDetalleVenta).HasColumnName("idDetalleVenta");
            entity.Property(e => e.Cantidad).HasColumnName("cantidad");
            entity.Property(e => e.IdProducto).HasColumnName("idProducto");
            entity.Property(e => e.IdVenta).HasColumnName("idVenta");
            entity.Property(e => e.Precio)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("precio");
            entity.Property(e => e.Total)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("total");

            entity.HasOne(d => d.IdProductoNavigation).WithMany(p => p.DetalleVentas)
                .HasForeignKey(d => d.IdProducto)
                .HasConstraintName("FK__DetalleVe__idPro__0F624AF8");

            entity.HasOne(d => d.IdVentaNavigation).WithMany(p => p.DetalleVentas)
                .HasForeignKey(d => d.IdVenta)
                .HasConstraintName("FK__DetalleVe__idVen__0E6E26BF");
        });

        modelBuilder.Entity<Productos>(entity =>
        {
            entity.HasKey(e => e.IdProducto).HasName("PK__Producto__07F4A132C5B16AD8");

            entity.HasIndex(e => e.Codigo, "UQ__Producto__40F9A206E9D92F97").IsUnique();

            entity.Property(e => e.IdProducto).HasColumnName("idProducto");
            entity.Property(e => e.Codigo)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("codigo");
            entity.Property(e => e.FechaCreacion).HasColumnName("fechaCreacion");
            entity.Property(e => e.Foto)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("foto");
            entity.Property(e => e.NitProveedor).HasColumnName("nitProveedor");
            entity.Property(e => e.Nombre)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("nombre");
            entity.Property(e => e.Valor)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("valor");

            entity.HasOne(d => d.NitProveedorNavigation).WithMany(p => p.Productos)
                .HasForeignKey(d => d.NitProveedor)
                .HasConstraintName("FK__Productos__nitPr__07C12930");
        });

        modelBuilder.Entity<Proveedores>(entity =>
        {
            entity.HasKey(e => e.Nit).HasName("PK__Proveedo__DF97D0E5967554D3");

            entity.Property(e => e.Nit)
                .ValueGeneratedNever()
                .HasColumnName("nit");
            entity.Property(e => e.Celular)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("celular");
            entity.Property(e => e.Ciudad)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("ciudad");
            entity.Property(e => e.Correo)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("correo");
            entity.Property(e => e.Nombre)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("nombre");
            entity.Property(e => e.Telefono)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("telefono");
        });

        modelBuilder.Entity<Roles>(entity =>
        {
            entity.HasKey(e => e.IdRol).HasName("PK__Roles__3C872F765B286950");

            entity.Property(e => e.IdRol).HasColumnName("idRol");
            entity.Property(e => e.Descripcion)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("descripcion");
            entity.Property(e => e.EsActivo).HasColumnName("esActivo");
            entity.Property(e => e.FechaRegistro)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("fechaRegistro");
        });

        modelBuilder.Entity<Usuarios>(entity =>
        {
            entity.HasKey(e => e.IdUsuario).HasName("PK__Usuarios__645723A6BC7457F9");

            entity.Property(e => e.IdUsuario).HasColumnName("idUsuario");
            entity.Property(e => e.Clave)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("clave");
            entity.Property(e => e.Correo)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("correo");
            entity.Property(e => e.EsActivo).HasColumnName("esActivo");
            entity.Property(e => e.IdRol).HasColumnName("idRol");
            entity.Property(e => e.Nombre)
                .HasMaxLength(40)
                .IsUnicode(false)
                .HasColumnName("nombre");
            entity.Property(e => e.Telefono)
                .HasMaxLength(40)
                .IsUnicode(false)
                .HasColumnName("telefono");

            entity.HasOne(d => d.IdRolNavigation).WithMany(p => p.Usuarios)
                .HasForeignKey(d => d.IdRol)
                .HasConstraintName("FK__Usuarios__idRol__03F0984C");
        });

        modelBuilder.Entity<Ventas>(entity =>
        {
            entity.HasKey(e => e.IdVenta).HasName("PK__Ventas__077D5614D519F780");

            entity.Property(e => e.IdVenta).HasColumnName("idVenta");
            entity.Property(e => e.DocumentoCliente)
                .HasMaxLength(40)
                .IsUnicode(false)
                .HasColumnName("documentoCliente");
            entity.Property(e => e.FechaRegistro)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("fechaRegistro");
            entity.Property(e => e.IdUsuario).HasColumnName("idUsuario");
            entity.Property(e => e.ImpuestoTotal)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("impuestoTotal");
            entity.Property(e => e.NombreCliente)
                .HasMaxLength(40)
                .IsUnicode(false)
                .HasColumnName("nombreCliente");
            entity.Property(e => e.SubTotal)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("subTotal");
            entity.Property(e => e.Total)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("total");

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.Ventas)
                .HasForeignKey(d => d.IdUsuario)
                .HasConstraintName("FK__Ventas__idUsuari__0B91BA14");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
