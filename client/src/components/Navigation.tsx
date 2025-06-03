import React from 'react';
import { Link } from 'react-router-dom';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import BarChartIcon from '@mui/icons-material/BarChart';

const Navigation: React.FC = () => {
  return (
    <div>
      <ListItem component={Link} to="/sleep-tracker">
        <ListItemIcon>
          <BedtimeIcon />
        </ListItemIcon>
        <ListItemText primary="수면 기록" />
      </ListItem>
      <ListItem component={Link} to="/sleep-analytics">
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="수면 분석" />
      </ListItem>
    </div>
  );
};

export default Navigation; 