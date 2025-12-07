// 【路由配置】- 定义应用的路由规则
import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import GamePage from '../pages/GamePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/game',
    element: <GamePage />,
  },
  {
    path: '*',
    element: <div style={{ 
      textAlign: 'center', 
      padding: '50px',
      color: 'white',
      fontSize: '24px'
    }}>
      404 - 页面不存在
      <br />
      <a href="/" style={{ color: '#fff', textDecoration: 'underline' }}>
        返回首页
      </a>
    </div>,
  },
]);