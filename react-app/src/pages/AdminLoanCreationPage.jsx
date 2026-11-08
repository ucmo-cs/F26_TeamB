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
import { useState } from "react";
import { VerticallyCenteredModal,  } from "../components/BootStrapComponents";
export default function AdminLoanCreationPage() {
    const [showSuccesModal, setShowSuccessModal] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [touchedFields, setTouchedFields] = useState({});
    const [invalidFields, setInvalidFields] = useState({});

    const validateField = (event) => {
        const { name, validity } = event.currentTarget;
        setTouchedFields((fields) => ({ ...fields, [name]: true }));
        setInvalidFields((fields) => ({ ...fields, [name]: !validity.valid }));
    };

    const fieldClassName = (name) =>
        `form-control${(submitted || touchedFields[name]) && invalidFields[name] ? " is-invalid" : ""}`;

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitted(true);

        const validity = {};
        Array.from(event.currentTarget.elements).forEach((element) => {
            if (element.name) {
                validity[element.name] = !element.validity.valid;
            }
        });
        setInvalidFields(validity);

        if (!event.currentTarget.checkValidity()) {
            return;
        }

        const formData = new FormData(event.target);
        const loanData = { // send this to backend to create new loan and send email to customer.
            customerFirstName: formData.get('firstName'),
            customerLastName: formData.get('lastName'),
            customerEmail: formData.get('email'),
            customerPhoneNumber: `${formData.get('phoneNumberPt1')}-${formData.get('phoneNumberPt2')}-${formData.get('phoneNumberPt3')}`,
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
            setShowSuccessModal(true);
        }
        catch (error) {
            console.error('Error creating loan:', error);
            alert('Failed to create loan. Please try again.');
        }
    };

    const setToday = () => {
        const today = new Date();
        const localDate = [
                today.getFullYear(),
                String(today.getMonth() + 1).padStart(2, "0"),
                String(today.getDate()).padStart(2, "0"),
            ].join("-");
        
        document.getElementById("loanDate").value = localDate;
        setTouchedFields((fields) => ({ ...fields, loanDate: true }));
        setInvalidFields((fields) => ({ ...fields, loanDate: false }));
    };


    
    return (
        <div className="container py-5">
            <div className="mx-auto" style={{ maxWidth: "640px" }}>
            <h1 className="h3 mb-4">Create New Loan</h1>

            <div className="card shadow-sm">
                <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                    <h2 className="h6 text-capitalize text-black mb-3">Customer Information</h2>
                    
                    <div className="row mb-3 align-items-center">
                        <label htmlFor="firstName" className="col-sm-4 col-form-label">First name</label>
                        <div className="col-sm-8">
                            <input type="text" className={fieldClassName("firstName")} id="firstName" name="firstName" minLength="1" maxLength="50" pattern="^[a-zA-Z]{1,50}$" onBlur={validateField} onChange={validateField} required />
                            <div className="invalid-feedback">Only use 1-50 letters for the first name.</div>
                        </div>
                    </div>

                    <div className="row mb-3 align-items-center">
                        <label htmlFor="lastName" className="col-sm-4 col-form-label">Last name</label>
                        <div className="col-sm-8">
                            <input type="text" className={fieldClassName("lastName")} id="lastName" name="lastName" minLength="1" maxLength="50" pattern="^[a-zA-Z]{1,50}$" onBlur={validateField} onChange={validateField} required />
                            <div className="invalid-feedback">Only use 1-50 letters for the last name.</div>
                        </div>
                    </div>

                    <div className="row mb-3 align-items-center">
                        <label htmlFor="email" className="col-sm-4 col-form-label">Email</label>
                        <div className="col-sm-8">
                            <input type="email" className={fieldClassName("email")} id="email" name="email" pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" onBlur={validateField} onChange={validateField} required />
                            <div className="invalid-feedback">Enter a valid email address.</div>
                        </div>
                    </div>

                    <div className="row mb-4 align-items-center">
                        <label htmlFor="phoneNumber" className="col-sm-4 col-form-label">Phone number</label>
                        <div className="col-sm-8 d-flex align-items-center">
                            <input type="tel" className={fieldClassName("phoneNumberPt1")} id="phoneNumberPt1" name="phoneNumberPt1" minLength="3" maxLength="3" pattern="^\d{3}$" onBlur={validateField} onChange={validateField} required />
                            <p className="align-self-center mb-0"> - </p>
                            <input type="tel" className={fieldClassName("phoneNumberPt2")} id="phoneNumberPt2" name="phoneNumberPt2" minLength="3" maxLength="3" pattern="^\d{3}$" onBlur={validateField} onChange={validateField} required/>
                            <p className="align-self-center mb-0"> - </p>
                            <input type="tel" className={fieldClassName("phoneNumberPt3")} id="phoneNumberPt3" name="phoneNumberPt3" minLength="4" maxLength="4" pattern="^\d{4}$" onBlur={validateField} onChange={validateField} required/>
                        </div>
                        <div className="invalid-feedback d-block">
                            {["phoneNumberPt1", "phoneNumberPt2", "phoneNumberPt3"].some((name) => (submitted || touchedFields[name]) && invalidFields[name])
                                ? "Enter a phone number in the format 000-000-0000."
                                : ""}
                        </div>
                    </div>

                    <hr className="my-4" />
                    <h2 className="h6 text-capitalize font-weight-bold text-main mb-3">Loan Information</h2>

                    <div className="row mb-3 align-items-center">
                        <label htmlFor="loanDate" className="col-sm-4 col-form-label">Loan Origin Date</label>
                        <div className="col-sm-8 d-flex align-items-center">
                            <input type="date" className={fieldClassName("loanDate")} id="loanDate" name="loanDate" onBlur={validateField} onChange={validateField} required />
                            <button type="button" className="flex justify-content-center align-items-center btn btn-outline-secondary text-black p-1 m-1" 
                                onClick={setToday}>Today</button>
                            <div className="invalid-feedback">Select a valid loan origin date.</div>
                        </div>
                    </div>

                    <div className="row mb-3 align-items-center">
                    <label htmlFor="originalAmount" className="col-sm-4 col-form-label">Principal</label>
                    <div className="col-sm-8">
                        <div className="input-group">
                            <span className="input-group-text">$</span>
                            <input type="number" className={fieldClassName("originalAmount")} id="originalAmount" name="originalAmount" min="0" step="0.01" onBlur={validateField} onChange={validateField} required />
                            <div className="invalid-feedback">Enter an amount with up to two decimal places.</div>
                        </div>
                    </div>
                    </div>

                    <div className="row mb-4 align-items-center">
                    <label htmlFor="interestRate" className="col-sm-4 col-form-label">Interest rate</label>
                    <div className="col-sm-8">
                        <div className="input-group">
                        <input type="number" className={fieldClassName("interestRate")} id="interestRate" name="interestRate" min="0" step="0.01" onBlur={validateField} onChange={validateField} required />
                        <span className="input-group-text">%</span>
                        <div className="invalid-feedback">Enter a rate with up to two decimal places.</div>
                        </div>
                    </div>
                    </div>

                    <div className="d-grid">
                    <button type="submit" className="btn btn-primary btn-lg">
                        Create loan &amp; send email
                    </button>
                    <button type="button" className="btn btn-outline-secondary text-black btn-lg mt-2" onClick={() => window.history.back()}>
                        Cancel
                    </button>
                    </div>
                </form>
                </div>
            </div>

            <p className="italic small mt-3">
                Note: Upon creating a new loan, a customer account will be automatically generated and the
                customer's account information will be emailed to the provided address.
            </p>
            {showSuccesModal && (
                <VerticallyCenteredModal
                    show={showSuccesModal}
                    onHide={() => {setShowSuccessModal(false); window.location.href = '/admin/';}}
                />
            )}
            </div>
        </div>
    );
}