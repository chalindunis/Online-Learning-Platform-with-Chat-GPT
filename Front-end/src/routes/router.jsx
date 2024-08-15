import {createBrowserRouter} from 'react-router-dom';
import MainLayout from "../layout/MainLayout";
import Home from '../pages/Home';
// const router =() => {
//     return (
//         <div>router</div>
//     )
// }

// export default router

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout/>,
    children:[
     {
        path: "/",
        element: <Home/>
     }   
    ]
  }
]);