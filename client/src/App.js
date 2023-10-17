import logo from './logo.svg';
import './App.css';
import Index from './pages/Index';
import About from './pages/About';
import Service from './pages/Service';
import Contact from './pages/Contact';
import AdminLogin from './Admin/adminLogin';
import Home from './Admin/home/Home';
import List from './Admin/list/List';
import New from './Admin/new/New';
import Single from './Admin/single/Single';
import "./style/dark.scss"
import SoleHome from './Sole Distributor/soleHome/soleHome'
import SoleLogin from './Sole Distributor/soleLogin'
import SoleSignup from './Sole Distributor/soleSignup'
import { useContext } from 'react';
import { DarkModeContext } from './context/darkModeContext';

 import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { productInputs, userInputs } from './Admin/formSource';
import NewProduct from './Admin/new/NewProduct';
import ProductList from './Admin/Components/datatable/ProductList'
import ProductUpdate from './Admin/new/ProductUpdate';
import SoleList from './Admin/Components/datatable/SoleList'
import SoleUpdate from './Admin/new/SoleUpdate';
import Table from './Admin/Components/table/Table'
import AdminLogout from './Admin/AdminLogout';
import CategoryProducts from './Admin/Components/Category/CategoryProducts';
import SoleProduct from './Sole Distributor/Components/Products/SoleProduct';
import DistributorNew from './Sole Distributor/Components/Distributors/DistributorNew';
import DistributorList from './Sole Distributor/Components/Distributors/DistributorList';
import DistributorUpdate from './Sole Distributor/Components/Distributors/DistributorUpdate';
import SoleLogout from './Sole Distributor/SoleLogout';
import Profile from './Sole Distributor/Components/Profile/Profile';

import DisHome from './Distributor/DisHome/DisHome'
import DisLogin from './Distributor/DisLogin'
import DisSignup from './Distributor/DisSignup'
import DisLogout from './Distributor/DisLogout';
import DisProfile from './Distributor/Components/Profile/Profile';
import AddRequest from './Distributor/Request/AddRequest';
import ViewRequest from './Distributor/Request/ViewRequest';
import RequestsManage from './Sole Distributor/Requests/RequestsManage';
import ViewRequests from './Sole Distributor/Requests/ViewRequests';
import Cart from './Sole Distributor/Components/Cart/Cart';
import Checkout from './Sole Distributor/Orders/Checkout';
import SoleOrders from './Sole Distributor/Orders/SoleOrders';
import AdminOrder from './Admin/Components/Orders/AdminOrders';
import BuyedProducts from './Sole Distributor/Components/Products/BuyedProducts';
import Inventory from './Sole Distributor/Components/Inventory/Inventory';



function App() {
  const {darkMode} = useContext(DarkModeContext);

  return (
    <div className={darkMode ? "app dark":"app"}>
      <Router>
        <Routes>
          {/* Landing Page Routes */}
        <Route exact path='/' element={<Index/>}></Route>
        <Route exact path='/about' element={<About/>}></Route>
        <Route exact path='/service' element={<Service/>}></Route>
        <Route exact path='/contact' element={<Contact/>}></Route>
       

        {/* Admin Components Routes */}
        <Route exact path='/admin/login' element={<AdminLogin />} />
        <Route exact path='/admin' element={<Home/>} />
        <Route exact path='/admin/logout' element={<AdminLogout/>} />


        <Route exact path='/admin/users'>
            <Route index element={<SoleList/>}/>
            <Route exact path=":id" element={<SoleUpdate/>}/>
            <Route exact path="new" element={<New/>}/>
       </Route>

        <Route exact path='/admin/products'>
            <Route index element={<ProductList/>}/>
            <Route exact path=":id" element={<ProductUpdate/>}/>
            <Route exact path="new" element={<NewProduct />}/>
       </Route>
       <Route exact path="/admin/categories/:id" element={<CategoryProducts/>} />
       <Route exact path='/admin/order' element={<AdminOrder/>}></Route>

       
       
       {/* Sole Distributor's Components Routes */}

       <Route exact path='/soleDistributor' element={<SoleHome/>} />
       <Route exact path='/soleDistributor/register' element={<SoleSignup />} />
        <Route exact path='/soleDistributor/signin' element={<SoleLogin />} />
        <Route exact path='/soleDistributor/logout' element={<SoleLogout/>} />
        <Route path="/soleDistributor/profile/:id" element={<Profile />} />

       <Route exact path='/soleDistributor/products' element={<SoleProduct/>}></Route>
      
       <Route exact path='/soleDistributor/users'>
            <Route index element={<DistributorList/>}/>
            <Route exact path=":id" element={<DistributorUpdate/>}/>
            <Route exact path="new" element={<DistributorNew/>}/>
       </Route>

       <Route exact path='/soleDistributor/applications' element={<RequestsManage/>}></Route>
       <Route exact path='/soleDistributor/applications/status' element={<ViewRequests/>}></Route>
       <Route exact path = {'/soleDistributor/cart'} element= {<Cart/>}/>
       <Route exact path = {'/soleDistributor/checkout'} element= {<Checkout/>}/>
       <Route exact path = {'/soleDistributor/orders'} element= {<SoleOrders/>}/>
       <Route exact path = {'/soleDistributor/my-products'} element= {<BuyedProducts/>}/>
       <Route exact path = {'/soleDistributor/inventory'} element= {<Inventory/>}/>

      {/*Distributor's Components Routes */}

      <Route exact path='/distributor' element={<DisHome/>} />
       <Route exact path='/distributor/register' element={<DisSignup />} />
        <Route exact path='/distributor/signin' element={<DisLogin />} />
        <Route exact path='/distributor/logout' element={<DisLogout/>} />
        <Route path="/distributor/profile/:id" element={<DisProfile />} />
        <Route path="/distributor/request/new" element={<AddRequest />} />
        <Route path="/distributor/requests" element={<ViewRequest
        />} />

      
        </Routes>
      </Router>
      
    </div>
  );
}

export default App;
