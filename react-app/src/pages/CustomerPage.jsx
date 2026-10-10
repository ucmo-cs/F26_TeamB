import 'bootstrap/dist/css/bootstrap.min.css'
import '../Custom.scss'
import '../App.css'
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoanComponent } from '../components/LoanComponent'
import { CustomerInfoComponent } from '../components/CustomerInfoComponent'
import { Container } from 'react-bootstrap'
import { CustomerLoanInfoContext } from '../contexts/CustomerLoanInfoContext';
import { CustomerInfoContext } from '../contexts/CustomerInfoContext';
import { CustomerNavBar } from '../components/CustomerNavBar';



export function CustomerPage(){
    const {user} = useAuth();
    const [customerInfo, setCustomerInfo] = useState(null);
    const [customerLoanInfo, setCustomerLoanInfo] = useState(null);
    const customerInfoAPi = `http://localhost:8081/api/customer/${user.customerId}`;
    const customerLoanInfoApi = `http://localhost:8081/api/customer/${user.customerId}/loans`;
    
    
    useEffect(() => {
            async function fetchCustomerInfo(){
                
                const customerInfoResponse = await fetch(customerInfoAPi, {
                method: 'GET',
                headers: {'Content-Type': 'application/json',},
                });

                const customerLoanInfoResponse = await fetch(customerLoanInfoApi, {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json',},
                });

                if (customerInfoResponse.ok && customerLoanInfoResponse.ok) {
                    const customerData = await customerInfoResponse.json();
                    const customerLoanData = await customerLoanInfoResponse.json();
                    setCustomerInfo(customerData);
                    setCustomerLoanInfo(customerLoanData[0]); // Assuming the API returns an array of loans, we take the first one
                }else {console.error("Failed to fetch customer information");}
                
            }
            fetchCustomerInfo();
        }, [customerInfoAPi, user]);


    return(
        <>
            <CustomerNavBar/>
            <Container className='mb-5'>
                <CustomerInfoContext.Provider value={{customerInfo, setCustomerInfo}}>
                    <CustomerLoanInfoContext.Provider value={{customerLoanInfo}}>
                        <LoanComponent/>
                        <CustomerInfoComponent/>    
                    </CustomerLoanInfoContext.Provider>
                </CustomerInfoContext.Provider>
            </Container>
        </>
    )
}