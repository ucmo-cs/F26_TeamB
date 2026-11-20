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
import { Link } from "react-router-dom";

// after successful login, admin is routed here.
export default function AdminPage() {
		const [loanArray, setLoanArray] = useState([]);
		const [error, setError] = useState(null);
		const [loading, setLoading] = useState(true);
		const [searchTerm, setSearchTerm] = useState('');

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

			const normalizedSearchTerm = searchTerm.trim().toLowerCase();
			const filteredLoans = normalizedSearchTerm
				? loanArray.filter((loan) => {
					const customerName = `${loan.customerFirstName ?? ''} ${loan.customerLastName ?? ''}`;
					const loanDate = loan.loanDate
						? (() => {
							const [year, month, day] = loan.loanDate.split('-');
							return `${month}/${day}/${year}`;
						})()
						: '';
					const searchableValues = [
						customerName,
						loan.customerEmail,
						loan.customerPhoneNumber,
						loanDate,
						loan.originalAmount,
						loan.remainingBalance,
						loan.interestRate,
					];

					return searchableValues
						.filter((value) => value !== null && value !== undefined)
						.some((value) => String(value).toLowerCase().includes(normalizedSearchTerm));
				})
				: loanArray;

		if(error){
			return <div className=" bg-light text-center content-center align-center">Error: {error}</div>;
		}
		else if(loading){
			return <div className=" bg-light text-center content-center">Loading loan data...</div>;
		}
		else{
			return (	
			<div className="flex text-center content-center align-middle p-5 rounded bg-light shadow-sm">
				{/* <h1>Welcome, Admin</h1> */}
				<p className="loan-details-eyebrow h4 mb-3">Table of all unpaid loans</p>
				<div className="loan-details h6 mb-3">Click on a loan to view more details</div>
				<div className="mb-3">
					<input
						type="search"
						name="search"
						className="form-control"
						placeholder="Search loans..."
						aria-label="Search unpaid loans"
						value={searchTerm}
						onChange={(event) => setSearchTerm(event.target.value)}
					/>
				</div>
				<div className="table-responsive rounded border bg-white shadow-sm">
				<table className="table table-striped table-hover align-middle mb-0">
					<thead className="table-light text-uppercase small text-secondary">
					<tr>
						<th scope="col" className="px-4 py-3 text-nowrap">Customer Name</th>
						<th scope="col" className="px-4 py-3 text-nowrap">Loan Start Date</th>
						<th scope="col" className="px-4 py-3 text-nowrap">Principal Amount</th>
						<th scope="col" className="px-4 py-3 text-nowrap">Balance Remaining</th>
						<th scope="col" className="px-4 py-3 text-nowrap">Interest Rate</th>
					</tr>
					</thead>
					<tbody>
					{filteredLoans.length === 0 ? (
						<tr>
							<td colSpan="5" className="px-4 py-3 text-secondary">
								No unpaid loans match your search.
							</td>
						</tr>
					) : filteredLoans.map((loan) => (
						<tr key={loan.id}>
						<td className="px-4 py-3">
							<Link to={`/admin/detailed/${loan.id}`} className="fw-medium text-decoration-none">
							{/* If customer info is not found, display "Customer not found" */}
							{loan.customerFirstName && loan.customerLastName
								? `${loan.customerFirstName} ${loan.customerLastName}`
								: loan.customerId ? "Customer not found" : "No customer associated"}
							</Link>
						</td>

						<td className="px-4 py-3">  
							{(() => {
									if (!loan.loanDate) return '';
									const [year, month, day] = loan.loanDate.split('-');
									return `${month}/${day}/${year}`;
									})()}</td> {/* format for better readability  MM/DD/YYYY*/}
						<td className="px-4 py-3">${loan.originalAmount.toLocaleString({ style: 'currency', currency: 'USD' })}</td>
						<td className="px-4 py-3">${loan.remainingBalance.toLocaleString({ style: 'currency', currency: 'USD' })}</td>
						<td className="px-4 py-3">{loan.interestRate}%</td>
						</tr>
					))}
					</tbody>
				</table>
				</div>
			</div>
		);
	}
}