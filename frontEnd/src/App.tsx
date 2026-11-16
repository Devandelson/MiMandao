import { Route, BrowserRouter, Routes } from 'react-router';

// ---------- views
// --------- Admin
import RequestUser from './modules/requestUser/viewRequest.tsx'
import ManageProduct from './modules/manageProduct/viewManage.tsx'

// --------- User
import UserSale from './modules/sale/user/view.tsx';
import OrderDetail from './modules/manageOrder/views/user/OrderView.tsx';

// ----- Both
import SingIn from './modules/login/singIn.tsx';
import NewAccount from './modules/login/newAccount.tsx';
import NewAccountGoogle from './modules/login/newAccountGoogle.tsx';
import Home from './modules/home/Mandao.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* General */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<SingIn />} />
        <Route path="/register" element={<NewAccount />} />
        <Route path="/Googleregister" element={<NewAccountGoogle />} />

        {/* Admin */}
        <Route path="/requestUser" element={<RequestUser />} />
        <Route path="/manageProduct" element={<ManageProduct />} />

        {/* User */}
        <Route path="/productView" element={<UserSale />} />
        <Route path="/order" element={<OrderDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
