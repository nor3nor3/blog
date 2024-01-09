import Footer from "./footer";
import Meta from "./meta";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <>
      <Meta />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
