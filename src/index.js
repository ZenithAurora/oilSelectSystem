import ReactDOM from 'react-dom/client';
import './index.scss';
import '@ant-design/v5-patch-for-react-19';
import store from './store';
import { Provider } from 'react-redux';


import { RouterProvider } from 'react-router-dom';
import router from './routes/index';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
