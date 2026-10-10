import {Route, Routes} from 'react-router-dom'
import AdminPage from "./../pages/AdminPage"
import ErrorPage from "./../pages/ErrorPage"
import LoginPage from "./../pages/LoginPage"
import AdminDetailedLoanPage from "./../pages/AdminDetailedLoanPage"
import AdminLoanCreationPage from "./../pages/AdminLoanCreationPage"
import AdminLayout from '../layouts/AdminLayout'
import { CustomerPage } from '../pages/CustomerPage'
import { CustomerSchedulePaymentPage } from '../pages/CustomerSchedulePaymentPage'
import { AuthProvider } from '../contexts/AuthContext';
import ProtectedRoute from './protectedRoutes';

export default function AppRoutes(){
    
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<LoginPage/>} />
                <Route element = {<ProtectedRoute role="admin" />} >
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminPage />} />
                        <Route path="/admin/detailed/:loanId" element={<AdminDetailedLoanPage />} />
                        <Route path="/admin/create-loan" element={<AdminLoanCreationPage />} />
                    </Route>
                </Route>
                <Route element = {<ProtectedRoute role="customer" />} >
                    <Route path = "/customer" element = { <CustomerPage /> } />
                    <Route path = "/customer/schedule-payment" element = { <CustomerSchedulePaymentPage /> } />
                </Route>
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </AuthProvider>
    )
};