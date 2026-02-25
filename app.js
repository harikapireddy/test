document.addEventListener('DOMContentLoaded', () => {
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    const steps = document.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.step');
    const form = document.getElementById('rentalApplication');

    let currentStepIndex = 0;

    function updateSteps() {
        // Update DOM visibility
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === currentStepIndex);
        });

        // Update Indicators
        stepIndicators.forEach((indicator, index) => {
            if (index < currentStepIndex) {
                indicator.classList.add('completed');
                indicator.classList.remove('active');
            } else if (index === currentStepIndex) {
                indicator.classList.add('active');
                indicator.classList.remove('completed');
            } else {
                indicator.classList.remove('active', 'completed');
            }
        });
    }

    function validateStep(index) {
        const currentStepEl = steps[index];
        const inputs = currentStepEl.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        // Clean up previous error messages
        currentStepEl.querySelectorAll('.error-msg').forEach(msg => msg.remove());

        inputs.forEach(input => {
            if (input.type === 'radio') {
                const groupName = input.name;
                const isChecked = currentStepEl.querySelector(`input[name="${groupName}"]:checked`);
                const questionEl = input.closest('.row-question');
                if (questionEl) questionEl.classList.remove('error');

                if (!isChecked) {
                    isValid = false;
                    if (questionEl) {
                        questionEl.classList.add('error');
                        if (!questionEl.querySelector('.error-msg')) {
                            const errorMsg = document.createElement('div');
                            errorMsg.className = 'error-msg';
                            errorMsg.textContent = 'Please make a selection';
                            questionEl.appendChild(errorMsg);
                        }
                    }
                }
            } else {
                input.parentElement.classList.remove('error');
                if (!input.checkValidity()) {
                    isValid = false;
                    input.parentElement.classList.add('error');

                    // Add error text
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'error-msg';
                    if (input.validity.valueMissing) {
                        if (input.type === 'checkbox') {
                            errorMsg.textContent = 'You must agree to proceed';
                        } else {
                            errorMsg.textContent = 'This field is required';
                        }
                    } else if (input.validity.typeMismatch) {
                        errorMsg.textContent = 'Invalid format';
                    } else {
                        errorMsg.textContent = 'Invalid input';
                    }

                    // Only append if it doesn't already have an error message
                    if (!input.parentElement.querySelector('.error-msg')) {
                        if (input.type === 'checkbox') {
                            errorMsg.style.position = 'relative';
                            errorMsg.style.bottom = '0';
                            input.parentElement.appendChild(errorMsg);
                        } else {
                            input.parentElement.appendChild(errorMsg);
                        }
                    }
                } else {
                    input.parentElement.classList.remove('error');
                }
            }
        });

        return isValid;
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStepIndex)) {
                if (currentStepIndex < steps.length - 2) { // -2 because of success step
                    currentStepIndex++;
                    updateSteps();
                }
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStepIndex > 0) {
                currentStepIndex--;
                updateSteps();
            }
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (validateStep(currentStepIndex)) {
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;

            // Simple prototype serializer since many inputs lack 'name' attributes
            const extractData = (stepElement) => {
                const data = {};
                if (!stepElement) return data;
                stepElement.querySelectorAll('input, select, textarea').forEach((el, index) => {
                    if (el.type === 'radio' && !el.checked) return;
                    if (el.type === 'checkbox') {
                        data[el.id || 'checkbox_' + index] = el.checked;
                        return;
                    }
                    // Try to find a label or default to ID
                    let key = el.id || el.name;
                    if (!key) {
                        const label = el.parentElement.querySelector('label');
                        key = label ? label.textContent.trim() : 'field_' + index;
                    }
                    data[key] = el.value;
                });
                return data;
            };

            const payload = {
                tenant_info: extractData(steps[0]),
                employment_info: extractData(steps[1]),
                residential_history: extractData(steps[2]),
                credit_history: extractData(steps[3]),
                authorization: extractData(steps[4])
            };

            fetch('http://localhost:3000/api/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
                .then(response => response.json())
                .then(data => {
                    // Show success step
                    currentStepIndex++;
                    updateSteps();

                    // Keep progress indicators filled
                    stepIndicators.forEach(i => {
                        i.classList.add('completed');
                        i.classList.remove('active');
                    });
                })
                .catch(error => {
                    console.error('Submission failed:', error);
                    alert('An error occurred while submitting the application.');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        }
    });

    // Dynamic Residences
    const addResidenceBtn = document.getElementById('addResidenceBtn');
    const residencesContainer = document.getElementById('residencesContainer');
    let residenceCount = 1;

    if (addResidenceBtn && residencesContainer) {
        addResidenceBtn.addEventListener('click', () => {
            if (residenceCount < 3) {
                residenceCount++;
                const newBlock = document.createElement('div');
                newBlock.className = 'residence-block';
                newBlock.style.marginTop = '2rem';
                newBlock.style.paddingTop = '1.5rem';
                newBlock.style.borderTop = '1px solid var(--border-color)';

                newBlock.innerHTML = `
                    <h3 class="subsection-title" style="margin-top: 0;">Previous Address ${residenceCount - 1}</h3>
                    <div class="input-group">
                        <label>Previous Address</label>
                        <textarea required placeholder="123 Old St, Apt 2\nCity, State, ZIP" rows="2"></textarea>
                    </div>
                    
                    <div class="grid-2-col">
                        <div class="input-group">
                            <label>Move In Date</label>
                            <input type="date" required>
                        </div>
                        <div class="input-group">
                            <label>Rent ($)</label>
                            <input type="number" required placeholder="1200">
                        </div>
                    </div>

                    <div class="grid-2-col">
                        <div class="input-group">
                            <label>Owner/Agent</label>
                            <input type="text" required placeholder="Jane Doe">
                        </div>
                        <div class="input-group">
                            <label>Phone</label>
                            <input type="tel" required placeholder="(555) 111-2222">
                        </div>
                    </div>

                    <div class="input-group">
                        <label>Reason for Leaving</label>
                        <input type="text" required placeholder="Job Relocation">
                    </div>
                `;
                residencesContainer.appendChild(newBlock);

                // Re-attach validation listeners to new fields
                attachValidationListeners(newBlock.querySelectorAll('input, textarea'));

                if (residenceCount >= 3) {
                    addResidenceBtn.style.display = 'none';
                }
            }
        });
    }

    // Handle input change to remove error class
    function attachValidationListeners(elements) {
        elements.forEach(input => {
            input.addEventListener('input', function () {
                if (this.type === 'radio') {
                    const questionEl = this.closest('.row-question');
                    if (questionEl) {
                        questionEl.classList.remove('error');
                        const errMsg = questionEl.querySelector('.error-msg');
                        if (errMsg) errMsg.remove();
                    }
                } else if (this.checkValidity()) {
                    this.parentElement.classList.remove('error');
                    const errMsg = this.parentElement.querySelector('.error-msg');
                    if (errMsg) errMsg.remove();
                }
            });
        });
    }

    attachValidationListeners(document.querySelectorAll('input, textarea, select'));

    // Credit History explanation dynamic toggle
    const creditRadios = document.querySelectorAll('#step4 input[type="radio"]');
    const creditExplanationGroup = document.getElementById('creditExplanationGroup');
    const creditExplanationInput = document.getElementById('creditExplanation');

    if (creditRadios.length > 0 && creditExplanationGroup && creditExplanationInput) {
        creditRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                // Check if any "Yes" radio is selected in step 4
                const anyYesSelected = Array.from(creditRadios).some(r => r.value === 'Yes' && r.checked);

                if (anyYesSelected) {
                    creditExplanationGroup.style.display = 'block';
                    creditExplanationInput.required = true;
                } else {
                    creditExplanationGroup.style.display = 'none';
                    creditExplanationInput.required = false;
                    creditExplanationInput.value = ''; // Clear value if hidden
                    creditExplanationInput.parentElement.classList.remove('error');
                    const errMsg = creditExplanationInput.parentElement.querySelector('.error-msg');
                    if (errMsg) errMsg.remove();
                }
            });
        });
    }
});
