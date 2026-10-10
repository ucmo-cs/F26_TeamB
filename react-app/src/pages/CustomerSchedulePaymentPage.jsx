import { CustomerNavBar } from '../components/CustomerNavBar';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CustomerLoanInfoContext } from '../contexts/CustomerLoanInfoContext';
import { LoanComponent } from '../components/LoanComponent';
import { SchedulePaymentComponent } from '../components/SchedulePaymentComponent';

/*
• After login, each customer should also have access to a page for scheduling payments. They
should be able to schedule their payments the following ways:
o Monthly, recurring on the same date every month.
o Bi-weekly, recurring on the same day of the week every two weeks.
o Weekly, recurring on the same day of the week every week.
• The customer scheduling page should also include a minimum payment based on the Standard
Amortization Formula, adjusted for the scheduling they choose.
o A Bi-weekly payment schedule, for example, should have a minimum payment based on
the amortization formula with 26 payments a year.
o A customer should not be able to schedule payments less than the calculated minimum
payment
*/

export function CustomerSchedulePaymentPage(){
    const [editMode, setEditMode] = useState(false);
    const {user} = useAuth();
    const [loanInfo, setLoanInfo] = useState(null);

    useEffect(() => {
        async function fetchLoanInfo(){

            const customerLoanInfoResponse = await fetch(`http://localhost:8081/api/customer/${user.customerId}/loans`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json',},
            });
        
            if (customerLoanInfoResponse.ok) {
                const loan = await customerLoanInfoResponse.json();
                setLoanInfo(loan[0]);
            }else{
                console.error("Failed to fetch loan information");
            }
        }
        fetchLoanInfo();
    }, [user.customerId]);

    return(
        <>
            <CustomerLoanInfoContext.Provider value = {{loanInfo, setLoanInfo, editMode, setEditMode}}>
                <CustomerNavBar/>
                <SchedulePaymentComponent/>
            </CustomerLoanInfoContext.Provider>
        </>
    )
}