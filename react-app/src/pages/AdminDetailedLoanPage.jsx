/*
TODO: 	
	• By clicking into one of the loans, the admin should be taken to a page dedicated to that loan where they see the following:  
        o The name of the customer who owns the loan.  
		o The date the loan was taken out.  
		o The amount of the loan that is still owed.  
		o The original amount of the loan.  
		o The loan’s interest rate.   
		o The email address of the customer who owns the loan.  
		o The phone number of the customer who owns the loan.  
		o Bank and account details for automatic payments.  
		o The customer’s scheduled automatic payments.  
		o A calculated pay-off date for the loan based on interest rate and scheduled payments.  
*/

// admin page for a specific loan, routed here by clicking on specific loan in table on AdminPage.jsx. 
import { useState, useEffect} from "react";
import { useParams } from "react-router-dom";


export default function AdminDetailedLoanPage() {
        const [loanDetails, setLoanDetails] = useState(null);
        const [error, setError] = useState(null);
        const [loading, setLoading] = useState(true);

        const { loanId } = useParams(); // Get the loanId from the URL parameters
        


        // fetch again to ensure we have most up-to-date info in case loan was updated since last loaded.
        useEffect(() => {
                // Fetch loan details from the backend API using the loanId
                const fetchLoanDetails = async () => {
                        try {
                            setLoading(true);
                            const response = await fetch(`http://localhost:8081/api/loans/${loanId}`); // Adjust the URL to backend endpoint
                            if (!response.ok) {
                                    throw new Error('Failed to load loan details.');
                            }
                            const data = await response.json();
                            setLoanDetails(data);
                            // I need to map the retrieved loan to the customer. 
                            const customerResponse = await fetch(`http://localhost:8081/api/customer/${data.customerId}`);
                            if (!customerResponse.ok) {
                                    throw new Error('Failed to load customer details.');
                            }
                            const customerData = await customerResponse.json();
                            if (!customerData|| Object.keys(customerData).length === 0) {
                                throw new Error('Customer not found.');
                            }
                            else {
                                setLoanDetails(prevDetails => ({ ...prevDetails, customer: customerData }));
                            }
                            
                        }
                        catch (error) {
                                setError(error.message);
                        } finally {
                            setLoading(false);
                        }
                }
                fetchLoanDetails();
        }, [loanId]); // Re-run the effect if loanId changes



        if (loading) {   
            return <div className="text-center bg-black text-green-500">Loading...</div>;   
        } 
        else if (error) { 
            return (
                <div>
                    <div className="text-center bg-red-500 text-white align-center"> Error: {error}</div>
                    <div><button className="btn btn-primary" href="/admin/loans">back to the previous page</button></div>
                </div>
            );
        } 
        else if (!loanDetails || loanDetails.length === 0) {
            return <div className="text-center content-center align-center">No loan details found.</div>;
        } 
        else {
            return (
                <div className="container py-5">
                    <div className="table-responsive rounded border bg-light shadow-sm mt-4">
                            <h3 className="px-4 py-3 text-nowrap"> Loan Details</h3>
                            <table className="table table-hover table-responsive p-4">
                                <thead>
                                    <tr>
                                        <th scope="col" className="px-4 py-3 text-nowrap">Loan Origination Date</th>
                                        <th scope="col" className="px-4 py-3 text-nowrap">Loan Principal Amount</th>
                                        <th scope="col" className="px-4 py-3 text-nowrap">Interest Rate</th>
                                        <th scope="col" className="px-4 py-3 text-nowrap">Remaining Balance</th>
                                        <th scope="col" className="px-4 py-3 text-nowrap">Scheduled Payment Amount</th>
                                        <th scope="col" className="px-4 py-3 text-nowrap">Calculated Pay-off Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>       
                                        <td className=" text-center px-4 py-3">{(() => {
                                            if (!loanDetails.loanDate) return '';
                                            const [year, month, day] = loanDetails.loanDate.split('-');
                                            return `${month}/${day}/${year}`;
                                        })()}</td>
                                        <td className="text-center px-4 py-3">{loanDetails.originalAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                        <td className="text-center px-4 py-3">{loanDetails.interestRate.toFixed(2)}%</td>
                                        <td className="text-center px-4 py-3">{loanDetails.remainingBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>

                                        <td className="text-center px-4 py-3">{loanDetails.scheduledPaymentAmount? ((loanDetails.scheduledPaymentAmount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })) : "N/A"}</td>
                                        <td className="text-center px-4 py-3">{loanDetails.loanEndDate ? (() => {
                                            if (!loanDetails.loanEndDate) return '';
                                            const [year, month, day] = loanDetails.loanEndDate.split('-');
                                            return `${month}/${day}/${year}`;
                                        }
                                        )() : 'N/A'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="table-responsive rounded border bg-light shadow-sm">
                        <h3 className="px-4 py-3 text-nowrap">Customer Details</h3>
                        <table className="table  table-hover table-responsive p-4">
                            <thead>
                                <tr >
                                    <th scope="col" className="px-4 py-3 text-nowrap">Customer Name</th>
                                    <th scope="col" className="px-4 py-3 text-nowrap">Customer Email</th>
                                    <th scope="col" className="px-4 py-3 text-nowrap">Customer Phone</th>
                                    <th scope="col" className="px-4 py-3 text-nowrap">Bank Name</th>
                                    <th scope="col" className="px-4 py-3 text-nowrap">Bank Account Number</th>
                                    <th scope="col" className="px-4 py-3 text-nowrap">Bank Routing Number</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="text-center px-4 py-3">{loanDetails.customerFirstName} {loanDetails.customerLastName}</td>
                                    <td className="text-center px-4 py-3">{loanDetails.customerEmail}</td>
                                    <td className="text-center qpx-4 py-3">{loanDetails.customer.phoneNumber ? ((loanDetails.customer.phoneNumber).replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')) : "N/A"}</td>
                                    <td className="text-center px-4 py-3">{loanDetails.customer.bankName ? loanDetails.customer.bankName : "N/A"}</td>
                                    <td className="text-center px-4 py-3">{loanDetails.customer.bankAccountNumber? loanDetails.customer.bankAccountNumber : "N/A"}</td>
                                    <td className="text-center px-4 py-3">{loanDetails.customer.bankRoutingNumber ? loanDetails.customer.bankRoutingNumber : "N/A"}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="d-flex justify-content-end align-items-center p-4">
                        <button className="btn btn-primary " onClick={() => window.history.back()}>Back</button>
                    </div>
                    {/* Add any additional content here */}
                </div>  
            );  
        }
};