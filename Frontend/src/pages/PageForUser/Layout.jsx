import React, { useContext } from "react";
import PropTypes from "prop-types";
import Header from "../../components/user/common/Header";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../../components/auth/AuthProvider";

const Layout = ({ setUser }) => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Header user={user} setUser={setUser} />
      <Outlet />
    </>
  );
};

Layout.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default Layout;
