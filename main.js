// DOM Elements
const mainContent = document.getElementById('mainContent');
const contactPage = document.getElementById('contactPage');
const termsPage = document.getElementById('termsPage');
const amountPage = document.getElementById('amountPage');
let pendingFormData = null;

// Page Navigation Functions
function showContactPage() {
    mainContent.style.display = 'none';
    contactPage.style.display = 'block';
    termsPage.style.display = 'none';
    amountPage.style.display = 'none';
    window.scrollTo(0, 0);
}

function showTermsPage() {
    mainContent.style.display = 'none';
    contactPage.style.display = 'none';
    termsPage.style.display = 'block';
    amountPage.style.display = 'none';
    window.scrollTo(0, 0);
}

function showAmountPage(minAmount, maxAmount, formData, contactInfo) {
    document.getElementById('minAmount').innerText = `$${minAmount.toLocaleString()}`;
    document.getElementById('maxAmount').innerText = `$${maxAmount.toLocaleString()}`;
    
    // Store data for PDF generation
    window.currentOfferData = {
        minAmount,
        maxAmount,
        formData,
        contactInfo
    };
    
    mainContent.style.display = 'none';
    contactPage.style.display = 'none';
    termsPage.style.display = 'none';
    amountPage.style.display = 'block';
    window.scrollTo(0, 0);
}

function showMainPage() {
    mainContent.style.display = 'block';
    contactPage.style.display = 'none';
    termsPage.style.display = 'none';
    amountPage.style.display = 'none';
    pendingFormData = null;
    window.currentOfferData = null;
    
    // Reset contact form
    document.getElementById('contactFirstName').value = '';
    document.getElementById('contactLastName').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactPhone').value = '';
    document.getElementById('contactNotes').value = '';
    
    // Reset checkboxes
    const term1 = document.getElementById('term1');
    const term2 = document.getElementById('term2');
    const term3 = document.getElementById('term3');
    const proceedFromTermsBtn = document.getElementById('proceedFromTermsBtn');
    
    if (term1) term1.checked = false;
    if (term2) term2.checked = false;
    if (term3) term3.checked = false;
    if (proceedFromTermsBtn) proceedFromTermsBtn.disabled = true;
}

function handleFormSuccess(formData, type) {
    pendingFormData = { formData, type };
    showContactPage();
}

// Calculate amount range based on asking price
function calculateAmountRange(askingPrice) {
    // Remove any non-numeric characters except decimal
    const price = parseFloat(askingPrice.toString().replace(/[^0-9.-]/g, ''));
    if (isNaN(price)) return { min: 0, max: 0 };
    
    // Calculate range: 70-85% of asking price
    const minAmount = Math.round(price * 0.70);
    const maxAmount = Math.round(price * 0.85);
    
    return { min: minAmount, max: maxAmount };
}

// Generate PDF Offer
function generatePDF() {
    if (!window.currentOfferData) return;
    
    const { minAmount, maxAmount, formData, contactInfo } = window.currentOfferData;
    
    const pdfContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>EzyRes - Official Offer Letter</title>
            <style>
                body {
                    font-family: 'Inter', 'Helvetica', sans-serif;
                    padding: 40px;
                    color: #1a1a1a;
                    line-height: 1.6;
                }
                .header {
                    text-align: center;
                    border-bottom: 2px solid #2c7a4d;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .logo {
                    font-size: 28px;
                    font-weight: 800;
                    color: #2c7a4d;
                }
                .date {
                    color: #6c757d;
                    margin-top: 10px;
                }
                .offer-title {
                    font-size: 24px;
                    font-weight: 800;
                    color: #2c7a4d;
                    text-align: center;
                    margin: 30px 0;
                }
                .offer-range {
                    background: linear-gradient(135deg, #2c7a4d 0%, #ffc107 100%);
                    padding: 30px;
                    border-radius: 16px;
                    text-align: center;
                    margin: 30px 0;
                    color: white;
                }
                .amount {
                    font-size: 32px;
                    font-weight: 800;
                    margin: 10px 0;
                }
                .details {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 12px;
                    margin: 20px 0;
                }
                .details h3 {
                    color: #2c7a4d;
                    margin-bottom: 15px;
                }
                .detail-row {
                    display: flex;
                    padding: 8px 0;
                    border-bottom: 1px solid #e9ecef;
                }
                .detail-label {
                    font-weight: 700;
                    width: 150px;
                }
                .detail-value {
                    flex: 1;
                    color: #495057;
                }
                .terms {
                    margin-top: 30px;
                    padding: 20px;
                    background: #fff8e7;
                    border-left: 4px solid #ffc107;
                }
                .footer {
                    text-align: center;
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 1px solid #dee2e6;
                    font-size: 12px;
                    color: #6c757d;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo">🏠 EzyRes</div>
                <div class="date">Official Offer Letter - ${new Date().toLocaleDateString()}</div>
            </div>
            
            <div class="offer-title">Your Property Offer Summary</div>
            
            <div class="offer-range">
                <div style="font-size: 18px; margin-bottom: 10px;">Estimated Offer Range</div>
                <div class="amount">$${minAmount.toLocaleString()} - $${maxAmount.toLocaleString()}</div>
                <div style="font-size: 14px; margin-top: 10px;">*Final offer after full underwriting</div>
            </div>
            
            <div class="details">
                <h3>Property Details</h3>
                <div class="detail-row">
                    <div class="detail-label">Property Address:</div>
                    <div class="detail-value">${formData.address || 'N/A'}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Asking Price:</div>
                    <div class="detail-value">$${formData.askingPrice || 'N/A'}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Estimated Land Value:</div>
                    <div class="detail-value">$${formData.landValue || 'N/A'}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Strategy:</div>
                    <div class="detail-value">${formData.strategy || 'N/A'}</div>
                </div>
                ${formData.newBuildValue ? `
                <div class="detail-row">
                    <div class="detail-label">New Build Value:</div>
                    <div class="detail-value">$${formData.newBuildValue}</div>
                </div>
                ` : ''}
            </div>
            
            <div class="details">
                <h3>Contact Information</h3>
                <div class="detail-row">
                    <div class="detail-label">Name:</div>
                    <div class="detail-value">${contactInfo.firstName} ${contactInfo.lastName}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Email:</div>
                    <div class="detail-value">${contactInfo.email}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Phone:</div>
                    <div class="detail-value">${contactInfo.phone}</div>
                </div>
                ${contactInfo.notes ? `
                <div class="detail-row">
                    <div class="detail-label">Notes:</div>
                    <div class="detail-value">${contactInfo.notes}</div>
                </div>
                ` : ''}
            </div>
            
            <div class="terms">
                <strong>📋 Terms Agreement</strong><br>
                • 72 Business Hours Exclusivity: EzyRes has exclusive right to sell<br>
                • 50/50 Joint Venture Split if buyer found outside EzyRes<br>
                • 50/50 Split of Assignment Fee regardless of sale method
            </div>
            
            <div class="footer">
                <p>This is a preliminary offer estimate. Official offer subject to full underwriting and property inspection.</p>
                <p>© 2025 EzyRes - We Buy Homes in Florida</p>
            </div>
        </body>
        </html>
    `;
    
    const win = window.open('', '_blank');
    win.document.write(pdfContent);
    win.document.close();
    win.print();
}

// Request Modal
const requestModal = document.getElementById('requestModal');
const requestForm = document.getElementById('requestPriceFormModal');
const closeReq = document.getElementById('closeRequestModal');
const openReqBtn = document.getElementById('openRequestModalBtn');

if (openReqBtn) {
    openReqBtn.onclick = () => requestModal.classList.add('active');
}
if (closeReq) {
    closeReq.onclick = () => requestModal.classList.remove('active');
}
if (requestModal) {
    requestModal.onclick = (e) => {
        if (e.target === requestModal) {
            requestModal.classList.remove('active');
        }
    };
}

if (requestForm) {
    requestForm.onsubmit = (e) => {
        e.preventDefault();
        const address = document.getElementById('modalAddress').value;
        const asking = document.getElementById('modalArv').value;
        const landVal = document.getElementById('modalRepairs').value;
        const newBuild = document.getElementById('modalPropType').value;
        const strategy = document.getElementById('modalStrategySelect').value;

        if (!address || !asking || !landVal || !strategy) {
            alert("Please fill all required fields");
            return;
        }

        const formData = {
            type: 'request',
            address,
            askingPrice: asking,
            landValue: landVal,
            newBuildValue: newBuild,
            strategy
        };
        handleFormSuccess(formData, 'request');
        requestModal.classList.remove('active');
    };
}

// Submit Modal
const submitModal = document.getElementById('submitModal');
const submitForm = document.getElementById('submitDealFormModal');
const closeSub = document.getElementById('closeSubmitModal');
const openSubBtn = document.getElementById('openSubmitModalBtn');

if (openSubBtn) {
    openSubBtn.onclick = () => submitModal.classList.add('active');
}
if (closeSub) {
    closeSub.onclick = () => submitModal.classList.remove('active');
}
if (submitModal) {
    submitModal.onclick = (e) => {
        if (e.target === submitModal) {
            submitModal.classList.remove('active');
        }
    };
}

if (submitForm) {
    submitForm.onsubmit = (e) => {
        e.preventDefault();
        const address = document.getElementById('modalLandAddress').value;
        const asking = document.getElementById('modalAskingPrice').value;
        const landVal = document.getElementById('modalLandValue').value;
        const newBuild = document.getElementById('modalNewBuildValue').value;
        const strategy = document.getElementById('modalStrategy').value;

        if (!address || !asking || !landVal || !strategy) {
            alert("Please fill all required fields");
            return;
        }

        const formData = {
            type: 'submit',
            address,
            askingPrice: asking,
            landValue: landVal,
            newBuildValue: newBuild,
            strategy
        };
        handleFormSuccess(formData, 'submit');
        submitModal.classList.remove('active');
    };
}

// Buy to Home buttons
const buyToHomeRequest = document.getElementById('buyToHomeRequest');
const buyToHomeSubmit = document.getElementById('buyToHomeSubmit');
if (buyToHomeRequest) buyToHomeRequest.onclick = () => requestModal.classList.remove('active');
if (buyToHomeSubmit) buyToHomeSubmit.onclick = () => submitModal.classList.remove('active');

// Contact Form Submission - now goes to Terms page
const contactForm = document.getElementById('contactDetailsForm');
if (contactForm) {
    contactForm.onsubmit = (e) => {
        e.preventDefault();

        const firstName = document.getElementById('contactFirstName').value;
        const lastName = document.getElementById('contactLastName').value;
        const email = document.getElementById('contactEmail').value;
        const phone = document.getElementById('contactPhone').value;
        const notes = document.getElementById('contactNotes').value;

        if (!firstName || !lastName || !email || !phone) {
            alert("Please fill all required contact fields.");
            return;
        }

        // Store contact info with pendingFormData
        if (pendingFormData) {
            pendingFormData.contactInfo = { firstName, lastName, email, phone, notes };
        }
        
        showTermsPage();
    };
}

// Terms page checkboxes logic
const term1 = document.getElementById('term1');
const term2 = document.getElementById('term2');
const term3 = document.getElementById('term3');
const proceedFromTermsBtn = document.getElementById('proceedFromTermsBtn');

function checkAllTerms() {
    if (proceedFromTermsBtn) {
        if (term1 && term2 && term3 && term1.checked && term2.checked && term3.checked) {
            proceedFromTermsBtn.disabled = false;
        } else {
            proceedFromTermsBtn.disabled = true;
        }
    }
}

if (term1) term1.addEventListener('change', checkAllTerms);
if (term2) term2.addEventListener('change', checkAllTerms);
if (term3) term3.addEventListener('change', checkAllTerms);

// Proceed from Terms page - save to Supabase and show amount range
if (proceedFromTermsBtn) {
    proceedFromTermsBtn.onclick = async () => {
        if (!pendingFormData) {
            showMainPage();
            return;
        }

        const { formData, type, contactInfo } = pendingFormData;
        
        // Calculate amount range based on asking price
        const { min, max } = calculateAmountRange(formData.askingPrice);
        
        const payload = {
            property_address: formData.address,
            asking_price: formData.askingPrice,
            estimated_land_value: formData.landValue,
            estimated_new_build: formData.newBuildValue || '',
            strategy: formData.strategy,
            submission_type: type,
            first_name: contactInfo.firstName,
            last_name: contactInfo.lastName,
            email: contactInfo.email,
            phone: contactInfo.phone,
            notes: contactInfo.notes,
            terms_accepted: true,
            min_offer_range: min,
            max_offer_range: max,
            created_at: new Date().toISOString()
        };

        try {
            const { error } = await window.supabaseClient.from('deals').insert([payload]);
            if (error) {
                console.error('Supabase error:', error);
                alert(`✅ Thank you ${contactInfo.firstName}! Your ${type === 'request' ? 'request' : 'deal'} has been received.`);
            } else {
                alert(`✅ Thank you ${contactInfo.firstName}! Your ${type === 'request' ? 'buy price request' : 'deal submission'} has been received.`);
            }
        } catch (err) {
            console.error('Error:', err);
            alert(`✅ Thank you! Your submission has been received.`);
        }

        // Show amount range page
        showAmountPage(min, max, formData, contactInfo);
    };
}

// Back buttons
const backToHomeFromContact = document.getElementById('backToHomeFromContactBtn');
const backToContactFromTerms = document.getElementById('backToContactFromTermsBtn');
const backToHomeFromAmount = document.getElementById('backToHomeFromAmountBtn');
const downloadPDFBtn = document.getElementById('downloadPDFBtn');

if (backToHomeFromContact) backToHomeFromContact.onclick = () => showMainPage();
if (backToContactFromTerms) backToContactFromTerms.onclick = () => showContactPage();
if (backToHomeFromAmount) backToHomeFromAmount.onclick = () => showMainPage();
if (downloadPDFBtn) downloadPDFBtn.onclick = () => generatePDF();

// Tutorial Modal
const tutorialModalEl = document.getElementById('tutorialModal');
const tutorialBtn = document.getElementById('tutorialBtn');
const closeTutorial = document.getElementById('closeTutorial');

if (tutorialBtn) {
    tutorialBtn.onclick = () => tutorialModalEl.classList.add('active');
}
if (closeTutorial) {
    closeTutorial.onclick = () => tutorialModalEl.classList.remove('active');
}
if (tutorialModalEl) {
    tutorialModalEl.onclick = (e) => {
        if (e.target === tutorialModalEl) {
            tutorialModalEl.classList.remove('active');
        }
    };
}

const requestTutorialBtn = document.getElementById('requestTutorialBtn');
const submitTutorialBtn = document.getElementById('submitTutorialBtn');

if (requestTutorialBtn) {
    requestTutorialBtn.onclick = () => {
        alert("📘 Request a Buy Price Tutorial:\n\n1. Click 'Request a Buy Price' button\n2. Fill property address, asking price, land value\n3. Select your investment strategy\n4. Submit and we'll contact you within 24h with an official offer!");
        tutorialModalEl.classList.remove('active');
    };
}
if (submitTutorialBtn) {
    submitTutorialBtn.onclick = () => {
        alert("📘 Submit a Deal Tutorial:\n\n1. Click 'Submit a Deal' button\n2. Enter land address, asking price, land value\n3. Choose your strategy\n4. Complete contact details and we'll review your deal within 24h!");
        tutorialModalEl.classList.remove('active');
    };
}

// FAQ Toggle
document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => q.parentElement.classList.toggle('active'));
});

// Counter Animation
let count = 0;
const counterEl = document.getElementById('dealsCounter');
const target = 487;
const updateCounter = () => {
    if (count < target) {
        count += Math.ceil(target / 60);
        if (count > target) count = target;
        if (counterEl) counterEl.innerText = count;
        setTimeout(updateCounter, 30);
    }
};
updateCounter();

// Initialize main page
showMainPage();