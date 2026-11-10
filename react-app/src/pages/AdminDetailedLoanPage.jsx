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
import "../App.css";

const currency = (value) => Number(value ?? 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
});

const formatDate = (value) => {
    if (!value) return "N/A";
    const [year, month, day] = value.split("-");
    return `${month}/${day}/${year}`;
};

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
                            const response = await fetch(`http://localhost:8081/api/loans/${loanId}`);
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
            const originalAmount = Number(loanDetails.originalAmount ?? 0);
            const remainingBalance = Number(loanDetails.remainingBalance ?? 0);
            const paidAmount = Math.max(0, originalAmount - remainingBalance);
            const paidPercent = originalAmount > 0
                ? Math.min(100, Math.max(0, (paidAmount / originalAmount) * 100))
                : 0;
            const customer = loanDetails.customer ?? {};

            return (
                <main className="loan-details-page py-4">
            <div className="mb-4">
                {/* <p className="loan-details-eyebrow mb-1">Loan #{loanId}</p> */}
                <h1 className="h2 mb-0">Loan overview</h1>
            </div>

            <div className="row g-4">
                <section className="col-12 col-xl-7">
                    <div className="loan-details-card h-100">
                        <div className="loan-details-card-header">
                            <div>
                                <p className="loan-details-eyebrow mb-1">Loan summary</p>
                                <h2 className="h4 mb-0">Loan details</h2>
                            </div>
                            {/* <span className="badge rounded-pill text-bg-success">Active</span> */}
                        </div>
                        <dl className="loan-details-grid mb-0">
                            <div><dt>Origination date</dt><dd>{formatDate(loanDetails.loanDate)}</dd></div>
                            <div><dt>Original principal</dt><dd>{currency(originalAmount)}</dd></div>
                            <div><dt>Interest rate</dt><dd>{Number(loanDetails.interestRate ?? 0).toFixed(2)}%</dd></div>
                            <div><dt>Remaining balance</dt><dd>{currency(remainingBalance)}</dd></div>
                            <div><dt>Scheduled payment</dt><dd>{loanDetails.scheduledPaymentAmount ? currency(loanDetails.scheduledPaymentAmount) : "N/A"}</dd></div>
                            <div><dt>Payment frequency</dt><dd>{loanDetails.paymentFrequency ?? "N/A"}</dd></div>
                            <div><dt>Calculated payoff date</dt><dd>{formatDate(loanDetails.loanEndDate)}</dd></div>
                        </dl>
                    </div>
                </section>

                <section className="col-12 col-xl-5">
                    <div className="loan-details-card h-100">
                        <div className="loan-details-card-header">
                            <div>
                                <p className="loan-details-eyebrow mb-1">Account holder</p>
                                <h2 className="h4 mb-0">Customer details</h2>
                            </div>
                        </div>
                        <dl className="loan-details-grid loan-customer-grid mb-0">
                            <div><dt>Name</dt><dd>{loanDetails.customerFirstName} {loanDetails.customerLastName}</dd></div>
                            <div><dt>Email</dt><dd className="text-break">{loanDetails.customerEmail}</dd></div>
                            <div><dt>Phone</dt><dd>{customer.phoneNumber ? customer.phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3") : "N/A"}</dd></div>
                            <div><dt>Bank</dt><dd>{customer.bankName || "N/A"}</dd></div>
                            <div><dt>Account number</dt><dd>{customer.bankAccountNumber || "N/A"}</dd></div>
                            <div><dt>Routing number</dt><dd>{customer.bankRoutingNumber || "N/A"}</dd></div>
                        </dl>
                    </div>
                </section>
            </div>

            <section className="loan-details-card payment-history-card mt-4">
                <div className="loan-details-card-header">
                    <div>
                        <p className="loan-details-eyebrow mb-1">Payment history</p>
                        <h2 className="h4 mb-1">Progress toward payoff</h2>
                        <p className="text-muted mb-0">Based on the current loan balance and scheduled payment plan.</p>
                    </div>
                    <strong className="payment-percent">{paidPercent.toFixed(0)}% paid</strong>
                </div>

                <div className="payment-progress" aria-label={`${paidPercent.toFixed(0)} percent of the principal paid`}>
                    <div className="payment-progress-bar" style={{ width: `${paidPercent}%` }} />
                </div>
                <div className="payment-progress-labels">
                    <span>{currency(paidAmount)} paid</span>
                    <span>{currency(remainingBalance)} remaining</span>
                </div>

                <div className="payment-timeline mt-4">
                    <div className="payment-timeline-step complete">
                        <span className="payment-timeline-dot" />
                        <strong>Loan originated</strong>
                        <span>{formatDate(loanDetails.loanDate)}</span>
                    </div>
                    <div className="payment-timeline-step current">
                        <span className="payment-timeline-dot" />
                        <strong>Current balance</strong>
                        <span>{currency(remainingBalance)} outstanding</span>
                    </div>
                    <div className="payment-timeline-step">
                        <span className="payment-timeline-dot" />
                        <strong>Projected payoff</strong>
                        <span>{formatDate(loanDetails.loanEndDate)}</span>
                    </div>
                </div>
            </section>

            <div className="d-flex justify-content-end mt-4">
                <button className="btn btn-primary" onClick={() => window.history.back()}>Back</button>
            </div>
                </main>
            );
        }
};