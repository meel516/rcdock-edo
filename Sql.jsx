import { useOutlet } from 'react-router-dom';
import React from 'react';

const Sql = React.memo(() => {
  const outlet = useOutlet();
  console.log(outlet, 'boi');
  return <div>sql componet</div>;
});
export default Sql;
