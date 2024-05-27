import { useRoutes } from 'react-router-dom';
import Er from './Er';
import Sql from './Sql';

export const SampleRoutes = () => {
  let routes = useRoutes([
    {
      path: '/path1',
      element: <Er />,
    },
    {
      path: ':any/path3',
      element: <Sql />,
    },
  ]);
  return routes;
};
