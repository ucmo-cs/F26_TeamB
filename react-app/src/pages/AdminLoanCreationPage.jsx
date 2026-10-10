/*
TODO:
	• An admin should also be able to access a screen for inputting new loans. When creating a loan they should provide the following:  
		o The name of the customer who owns the loan.  
		o The email address of the customer who owns the loan.  
		o The phone number of the customer who owns the loan.  
		o The date the loan was taken out.  
		o The original amount of the loan.  
		o The loan’s interest rate.

    • When the admin creates a new loan, a customer account should be automatically generated and the customer’s account information should be automatically emailed to the provided address. 
*/

export default function AdminLoanCreationPage() {

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const loanData = { // send this to backend to create new loan and send email to customer.
            customerFirstName: formData.get('firstName'),
            customerLastName: formData.get('lastName'),
            customerEmail: formData.get('email'),
            customerPhoneNumber: formData.get('phoneNumber'),
            loanDate: formData.get('loanDate'),
            originalAmount: Number(formData.get('originalAmount')),
            interestRate: Number(formData.get('interestRate')),
        };
        try{
            const response = await fetch('http://localhost:8081/api/loan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loanData),
            });
            if (!response.ok) {
            const body = await response.json().catch(() => null);
            throw new Error(body?.message ?? `Request failed (${response.status})`);
            }
            alert('Loan created and email sent successfully!');
        }
        catch (error) {
            console.error('Error creating loan:', error);
            alert('Failed to create loan. Please try again.');
        }
    };


    
    return (
        <div className="container py-5">
            <div className="mx-auto" style={{ maxWidth: "640px" }}>
            <h1 className="h3 mb-4">Create New Loan</h1>

            <div className="card shadow-sm">
                <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                    <h2 className="h6 text-uppercase text-secondary mb-3">Customer</h2>

                    <div className="row mb-3 align-items-center">
                    <label htmlFor="firstName" className="col-sm-4 col-form-label">First name</label>
                    <div className="col-sm-8">
                        <input type="text" className="form-control" id="firstName" name="firstName" required />
                    </div>
                    </div>

                    <div className="row mb-3 align-items-center">
                    <label htmlFor="lastName" className="col-sm-4 col-form-label">Last name</label>
                    <div className="col-sm-8">
                        <input type="text" className="form-control" id="lastName" name="lastName" required />
                    </div>
                    </div>

                    <div className="row mb-3 align-items-center">
                    <label htmlFor="email" className="col-sm-4 col-form-label">Email</label>
                    <div className="col-sm-8">
                        <input type="email" className="form-control" id="email" name="email" required />
                    </div>
                    </div>

                    <div className="row mb-4 align-items-center">
                    <label htmlFor="phoneNumber" className="col-sm-4 col-form-label">Phone number</label>
                    <div className="col-sm-8">
                        <input type="tel" className="form-control" id="phoneNumber" name="phoneNumber" required />
                    </div>
                    </div>

                    <hr className="my-4" />
                    <h2 className="h6 text-uppercase text-secondary mb-3">Loan</h2>

                    <div className="row mb-3 align-items-center">
                    <label htmlFor="loanDate" className="col-sm-4 col-form-label">Loan date</label>
                    <div className="col-sm-8">
                        <input type="date" className="form-control" id="loanDate" name="loanDate" required />
                    </div>
                    </div>

                    <div className="row mb-3 align-items-center">
                    <label htmlFor="originalAmount" className="col-sm-4 col-form-label">Original amount</label>
                    <div className="col-sm-8">
                        <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input type="number" className="form-control" id="originalAmount" name="originalAmount" min="0" required />
                        </div>
                    </div>
                    </div>

                    <div className="row mb-4 align-items-center">
                    <label htmlFor="interestRate" className="col-sm-4 col-form-label">Interest rate</label>
                    <div className="col-sm-8">
                        <div className="input-group">
                        <input type="number" className="form-control" id="interestRate" name="interestRate" step="0.01" required />
                        <span className="input-group-text">%</span>
                        </div>
                    </div>
                    </div>

                    <div className="d-grid">
                    <button type="submit" className="btn btn-primary btn-lg">
                        Create loan &amp; send email
                    </button>
                    </div>
                </form>
                </div>
            </div>

            <p className="small mt-3">
                Note: Upon creating a new loan, a customer account will be automatically generated and the
                customer's account information will be emailed to the provided address.
            </p>
            </div>
        </div>
    );
}