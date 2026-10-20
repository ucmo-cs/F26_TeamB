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
            return <div className=" bg-light text-center content-center align-center">Loading...</div>;   
        } 
        else if (error) { 
            return <div className=" bg-light text-center content-center align-center">Error: {error}</div>;
        } 
        else if (!loanDetails || loanDetails.length === 0) {
            return <div className=" bg-light text-center content-center align-center">No loan details found.</div>;
        } 
        else {
            return (
                <div className=" bg-light text-center content-center align-center">
                    <h1>Loan Details for Loan ID: {loanId}</h1>
                    <p>Customer Name: {loanDetails.customerFirstName} {loanDetails.customerLastName}</p>
                    <p>Loan Date: {loanDetails.loanDate}</p>
                    <p>Amount Owed: {loanDetails.remainingBalance}</p>
                    <p>Original Amount: {loanDetails.originalAmount}</p>
                    <p>Interest Rate: {loanDetails.interestRate}</p>
                    <p>Customer Email: {loanDetails.customerEmail}</p>
                    <p>Customer Phone: {loanDetails.customer.phoneNumber}</p>
                    <p>Bank Name: {loanDetails.customer.bankName}</p>
                    <p>Bank Account Number: {loanDetails.customer.bankAccountNumber}</p>
                    <p>Bank Routing Number: {loanDetails.customer.bankRoutingNumber}</p>
                    <p>Scheduled Payment Amount: {loanDetails.scheduledPaymentAmount}</p>
                    {loanDetails.loanEndDate && <p>Calculated Pay-off Date: {loanDetails.loanEndDate}</p>}
                </div>
            );
        }
};