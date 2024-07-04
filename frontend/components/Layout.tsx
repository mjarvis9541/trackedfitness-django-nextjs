import { Inter } from "@next/font/google";
import Navbar from "./Navbar";

const inter = Inter({ subsets: ["latin"] });

const Layout = ({ children }) => {
  return (
    <>
      <div className={inter.className}>
        <Navbar />
        <main>{children}</main>
      </div>
    </>
  );
};

export default Layout;
