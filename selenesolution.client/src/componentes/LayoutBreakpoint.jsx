
function LayoutBreakpoint() {
  return (
      <div className="border border-danger">
          <h1 className="d-block d-sm-none">XS</h1>
          <h1 className="d-none d-sm-block d-md-none">SM</h1>
          <h1 className="d-none d-md-block d-lg-none">MD</h1>
          <h1 className="d-none d-lg-block d-xl-none">LG</h1>
          <h1 className="d-none d-xl-block">XL</h1>
      </div>
  );
}

export default LayoutBreakpoint;