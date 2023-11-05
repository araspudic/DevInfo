import React, { useState, useEffect } from 'react';
import AssessmentIcon from '@mui/icons-material/Assessment';
import './PageTransition.css';

function PageTransition() {
  return (
    <div className="transition-container">
      <AssessmentIcon className="rotate-fade" />
    </div>
  );
}

export default PageTransition;
