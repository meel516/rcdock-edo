import { useContext, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { refContext } from './refContext';

export default function CustomOutlet({ label }) {
  const mainref = useContext(refContext);
  useEffect(() => {
    console.log(label, 'abbas');
  });
  console.log(mainref.current, 'apple');

  return <Outlet />;
}
