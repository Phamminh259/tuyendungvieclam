import React from 'react';
import { useParams } from 'react-router-dom';
import Footer from '../../components/user/common/Footer';
import JobDetailCombined from '../../components/user/jobDetail/JobDetailCombined';

const DetailJob = () => {
  const { id } = useParams();

  return (
    <div>
      <JobDetailCombined jobId={id} />
      <Footer />
    </div>
  );
};

export default DetailJob;
