import React from 'react';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';
import HeaderJobs from './HeaderJobs';

const HeaderJobsLayout = ({ user, setUser }) => {
  return (
    <div>
      <HeaderJobs user={user} setUser={setUser} />
      <Outlet />
    </div>
  );
};

HeaderJobsLayout.propTypes = {
  user: PropTypes.shape({
    full_name: PropTypes.string,
  }),
  setUser: PropTypes.func.isRequired,
};

export default HeaderJobsLayout;
