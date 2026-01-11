
const Footer = () => {
  return (
    <>
      <footer className="main-footer text-center">
        <div className="pull-right d-none d-sm-inline-block"></div>
        <span className="text-muted">{new Date().getFullYear()} ©  Inventory Management | Restricted Area</span>
      </footer>
    </>
  );
};
export default Footer;
