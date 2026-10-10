/* 
Admin Portal Requirements:

DONE: 
	• An admin should be able to log in to an admin portal using pre-established credentials and a simple login page. Credentials can be stored in a database, but no encryption of the password is required for this project.  
	• After logging in, an admin should have access to a screen with a table of all loans that have not been fully repaid. On this table they should see the following:  
		o The name of the customer who owns the loan.  
		o The date the loan was taken out.  
		o The amount of the loan that is still owed.  
		o The original amount of the loan.  
		o The loan’s interest rate.  
TODO: 	
	• By clicking into one of the loans, the admin should be taken to a page dedicated to that loan where they see the following:  
		o All data listed on the table above.  
		o The email address of the customer who owns the loan.  
		o The phone number of the customer who owns the loan.  
		o Bank and account details for automatic payments.  
		o The customer’s scheduled automatic payments.  
		o A calculated pay-off date for the loan based on interest rate and scheduled payments.  
TODO:
	• An admin should also be able to access a screen for inputting new loans. When creating a\ loan they should provide the following:  
		o The name of the customer who owns the loan.  
		o The email address of the customer who owns the loan.  
		o The phone number of the customer who owns the loan.  
		o The date the loan was taken out.  
		o The original amount of the loan.  
		o The loan’s interest rate.

• When the admin creates a new loan, a customer account should be automatically generated and the customer’s account information should be automatically emailed to the provided address. 
*/

import { useState, useEffect } from "react";
import { LoanTable } from "../components/BootStrapComponents";

// after successful login, admin is routed here.
export default function AdminPage() {
		const [loanArray, setLoanArray] = useState([]);
		const [error, setError] = useState(null);
		const [loading, setLoading] = useState(true);

		useEffect(() => {
				// Fetch all loans from the backend API
				const fetchLoans = async () => {
						try {
							setLoading(true);
							const response = await fetch('http://localhost:8081/api/admin'); // !important Adjust the URL to backend endpoint
							
							if (!response.ok) {
								throw new Error('Failed to load loan data.');
							}
							
							const data = await response.json();
							setLoanArray(data);
							setLoading(false);
					
						}
						catch(error){
							setError(error.message);
						} finally{
							setLoading(false);
						}
					}
				fetchLoans();
			},[]); // just run on component mount
			

			
		if(error){
			return <div className=" bg-light text-center content-center align-center">Error: {error}</div>;
		}
		else if(loading){
			return <div className=" bg-light text-center content-center">Loading loan data...</div>;
		}
		else{
			return (	
			<div className="flex text-center content-center align-middle bg-light p-5 rounded">
				<h1>Welcome, Admin</h1>
				<p>Table of all unpaid loans</p>
				<LoanTable loans={loanArray}/>
			</div>
		);
	}
}