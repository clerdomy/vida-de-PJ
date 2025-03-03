// Constantes fiscais
const INSS_RANGES_2025 = [
    { limit: 1518.00, rate: 0.075 },
    { limit: 2793.88, rate: 0.09 },
    { limit: 4190.83, rate: 0.12 },
    { limit: 8157.41, rate: 0.14 }
];

const IR_RANGES_2025 = [
    { limit: 2259.20, rate: 0.00, deduction: 0.00 },
    { limit: 2824.00, rate: 0.00, deduction: 564.80, special: true },
    { limit: 2828.65, rate: 0.075, deduction: 169.44 },
    { limit: 3751.05, rate: 0.15, deduction: 381.44 },
    { limit: 4664.68, rate: 0.225, deduction: 662.77 },
    { limit: Infinity, rate: 0.275, deduction: 896.00 }
];

const EMPLOYER_CHARGES = {
    inss: 0.20,
    rat: 0.02,
    others: 0.058
};

// Estado global
let benefits = [];
let activeTab = 'summary';
let selectedTaxRegime = 'simples';
let customTaxRate = 0.06;

// Elementos DOM
const benefitsList = document.getElementById('benefits-list');
const benefitsTable = document.getElementById('benefits-table').querySelector('tbody');
const modal = document.getElementById('benefit-modal');
const form = document.getElementById('salary-form');
const tabs = document.querySelectorAll('[data-tab]');
const tabContents = document.querySelectorAll('[id^="tab-"]');

// Formatação de moeda
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Converte string de moeda para número
function currencyToNumber(str) {
    if (!str) return 0;
    return Number(str.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
}

// Formata campos de moeda em tempo real
function setupCurrencyInput(input) {
    input.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value) {
            value = (parseInt(value) / 100).toFixed(2);
            e.target.value = formatCurrency(value);
        } else {
            e.target.value = '';
        }
    });
}

// Configura inputs de moeda
setupCurrencyInput(document.getElementById('clt-salary'));
setupCurrencyInput(document.getElementById('benefit-value'));

// Gerenciamento de benefícios
document.getElementById('add-benefit').addEventListener('click', () => {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
});

function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.getElementById('benefit-name').value = '';
    document.getElementById('benefit-value').value = '';
    document.getElementById('benefit-taxable').checked = false;
}

function saveBenefit() {
    const name = document.getElementById('benefit-name').value;
    const value = document.getElementById('benefit-value').value;
    const isTaxable = document.getElementById('benefit-taxable').checked;
    
    if (!validateBenefitInput(name, value)) return;

    const benefit = {
        id: Date.now(),
        name,
        value: currencyToNumber(value),
        taxable: isTaxable
    };

    benefits.push(benefit);
    updateBenefitsList();
    closeModal();
}

// Validation Functions
function validateBenefitInput(name, value) {
    let isValid = true;
    const benefitValue = currencyToNumber(value);

    if (!name.trim()) {
        showError('benefit-name', 'Nome do benefício é obrigatório');
        isValid = false;
    }

    if (benefitValue <= 0) {
        showError('benefit-value', 'Valor deve ser maior que zero');
        isValid = false;
    }

    return isValid;
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    const errorDiv = document.getElementById(`${elementId}-error`) || 
                   createErrorElement(elementId);
    
    element.classList.add('border-destructive');
    errorDiv.textContent = message;
}

function createErrorElement(elementId) {
    const errorDiv = document.createElement('div');
    errorDiv.id = `${elementId}-error`;
    errorDiv.className = 'mt-1 text-sm text-destructive';
    document.getElementById(elementId).parentNode.appendChild(errorDiv);
    return errorDiv;
}

function clearError(elementId) {
    const element = document.getElementById(elementId);
    const errorDiv = document.getElementById(`${elementId}-error`);
    
    if (element) {
        element.classList.remove('border-destructive');
    }
    if (errorDiv) {
        errorDiv.textContent = '';
    }
}

// Atualiza a lista de benefícios
function updateBenefitsList() {
    benefitsList.innerHTML = '';
    benefitsTable.innerHTML = '';

    benefits.forEach((benefit, index) => {
        // Lista principal de benefícios
        const benefitItem = document.createElement('div');
        benefitItem.className = 'flex items-center justify-between rounded-lg border border-input bg-background px-4 py-2';
        benefitItem.innerHTML = `
            <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-muted-foreground">
                    <path d="M21 16V8a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2Z"></path>
                    <path d="M13 12v4"></path>
                    <path d="M13 8v4"></path>
                </svg>
                <span class="text-sm font-medium text-foreground">${benefit.name}</span>
                ${benefit.taxable ? '<span class="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive">Tributável</span>' : ''}
            </div>
            <div class="flex items-center gap-2">
                <span class="text-sm text-muted-foreground">${formatCurrency(benefit.value)}</span>
                <button onclick="deleteBenefit(${index})" class="rounded-full p-1 hover:bg-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        `;
        benefitsList.appendChild(benefitItem);

        // Tabela detalhada de benefícios
        const tableRow = document.createElement('tr');
        tableRow.innerHTML = `
            <td class="px-4 py-2 text-sm text-muted-foreground">${benefit.name}</td>
            <td class="px-4 py-2 text-sm font-medium text-foreground">${formatCurrency(benefit.value)}</td>
        `;
        benefitsTable.appendChild(tableRow);
    });
}

function deleteBenefit(index) {
    benefits.splice(index, 1);
    updateBenefitsList();
}

// Gerenciamento de tabs
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove classes ativas de todas as tabs
        tabs.forEach(t => {
            t.classList.remove('border-b-2', 'border-primary', 'text-primary');
            t.classList.add('text-muted-foreground');
        });

        // Adiciona classes ativas na tab clicada
        tab.classList.remove('text-muted-foreground');
        tab.classList.add('border-b-2', 'border-primary', 'text-primary');

        // Esconde todos os conteúdos
        tabContents.forEach(content => content.classList.add('hidden'));

        // Mostra o conteúdo da tab selecionada
        const tabContent = document.getElementById(`tab-${tab.dataset.tab}`);
        if (tabContent) {
            tabContent.classList.remove('hidden');
        }
    });
});

// Seleção de regime tributário
document.querySelectorAll('[data-regime]').forEach(card => {
    card.addEventListener('click', function() {
        // Remove seleção anterior
        document.querySelectorAll('[data-regime]').forEach(c => {
            c.classList.remove('border-primary', 'bg-primary/5');
            c.classList.add('border-input', 'bg-background');
        });

        // Adiciona seleção ao card clicado
        this.classList.remove('border-input', 'bg-background');
        this.classList.add('border-primary', 'bg-primary/5');

        // Atualiza regime selecionado e alíquota
        selectedTaxRegime = this.dataset.regime;
        const defaultRate = selectedTaxRegime === 'simples' ? '6.00' : '13.33';
        document.getElementById('tax-rate').value = `${defaultRate}%`;
        customTaxRate = parseFloat(defaultRate) / 100;
    });
});

// Formatação da alíquota
document.getElementById('tax-rate').addEventListener('input', function(e) {
    let value = e.target.value.replace(/[^\d.]/g, '');
    if (value) {
        value = parseFloat(value).toFixed(2);
        e.target.value = `${value}%`;
        customTaxRate = parseFloat(value) / 100;
    }
});

// Cálculos principais
function calculateINSS(salary) {
    let inss = 0;
    let remainingSalary = salary;

    for (const range of INSS_RANGES_2025) {
        if (remainingSalary <= 0) break;

        const prevLimit = INSS_RANGES_2025[INSS_RANGES_2025.indexOf(range) - 1]?.limit || 0;
        const taxableAmount = Math.min(remainingSalary, range.limit - prevLimit);
        
        inss += taxableAmount * range.rate;
        remainingSalary -= taxableAmount;
    }

    return Math.min(inss, 1076.46); // Teto INSS 2025
}

function calculateIR(baseValue, dependents) {
    const base = baseValue - (dependents * 189.59);
    let ir = 0;

    // Verifica o desconto especial primeiro
    if (base > 2259.20 && base <= 2824.00) {
        return 0; // Faixa de isenção especial
    }

    for (const range of IR_RANGES_2025) {
        if (base <= range.limit) {
            ir = (base * range.rate) - range.deduction;
            break;
        }
    }

    return Math.max(ir, 0);
}

// Animações
function animateValue(element, start, end, duration = 500) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const value = start + (end - start) * progress;
        element.textContent = formatCurrency(value);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Atualização dos resultados com animação
function updateResults(data) {
    // Resultados CLT
    animateValue(document.getElementById('clt-gross'), 
                currencyToNumber(document.getElementById('clt-gross').textContent),
                data.cltSalary + data.taxableBenefits);
    
    animateValue(document.getElementById('clt-discounts'),
                currencyToNumber(document.getElementById('clt-discounts').textContent),
                data.inss + data.ir);
    
    animateValue(document.getElementById('clt-benefits'),
                currencyToNumber(document.getElementById('clt-benefits').textContent),
                data.taxableBenefits + data.nonTaxableBenefits);
    
    animateValue(document.getElementById('clt-liquid'),
                currencyToNumber(document.getElementById('clt-liquid').textContent),
                data.cltLiquid);

    // Resultados PJ
    animateValue(document.getElementById('pj-gross'),
                currencyToNumber(document.getElementById('pj-gross').textContent),
                data.pjMonthly);
    
    animateValue(document.getElementById('pj-tax'),
                currencyToNumber(document.getElementById('pj-tax').textContent),
                data.pjTax);
    
    animateValue(document.getElementById('pj-liquid'),
                currencyToNumber(document.getElementById('pj-liquid').textContent),
                data.pjLiquid);

    // Custos do empregador
    animateValue(document.getElementById('employer-inss'),
                currencyToNumber(document.getElementById('employer-inss').textContent),
                data.cltSalary * EMPLOYER_CHARGES.inss);
    
    animateValue(document.getElementById('employer-other'),
                currencyToNumber(document.getElementById('employer-other').textContent),
                data.cltSalary * (EMPLOYER_CHARGES.rat + EMPLOYER_CHARGES.others));
    
    animateValue(document.getElementById('employer-total'),
                currencyToNumber(document.getElementById('employer-total').textContent),
                data.employerTotal);

    // Detalhamento
    document.getElementById('detail-salary').textContent = formatCurrency(data.cltSalary);
    document.getElementById('detail-inss').textContent = formatCurrency(data.inss);
    document.getElementById('detail-ir-base').textContent = formatCurrency(data.irBase);
    document.getElementById('detail-ir').textContent = formatCurrency(data.ir);
    document.getElementById('detail-fgts').textContent = formatCurrency(data.fgts);
    document.getElementById('detail-vacation').textContent = formatCurrency(data.vacation);
    document.getElementById('detail-13').textContent = formatCurrency(data.thirteenth);

    // Mostra mensagem de sucesso
    const successMessage = document.getElementById('success-message');
    successMessage.classList.remove('hidden');
    setTimeout(() => {
        successMessage.classList.add('hidden');
    }, 3000);
}

// Validação do formulário
function validateForm() {
    let isValid = true;
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = '';

    // Valida salário CLT
    const cltSalary = currencyToNumber(document.getElementById('clt-salary').value);
    if (!cltSalary || cltSalary <= 0) {
        errorMessage.textContent = 'Por favor, insira um salário válido';
        isValid = false;
    }

    // Valida alíquota PJ
    const taxRateStr = document.getElementById('tax-rate').value;
    const taxRate = parseFloat(taxRateStr);
    if (isNaN(taxRate) || taxRate <= 0 || taxRate > 100) {
        errorMessage.textContent = 'Por favor, insira uma alíquota válida (entre 0 e 100)';
        isValid = false;
    }

    // Valida dependentes
    const dependents = parseInt(document.getElementById('dependents').value);
    if (isNaN(dependents) || dependents < 0) {
        errorMessage.textContent = 'O número de dependentes não pode ser negativo';
        isValid = false;
    }

    return isValid;
}

// Limpar formulário
function resetForm() {
    form.reset();
    benefits = [];
    updateBenefitsList();
    
    // Reseta todos os valores
    const elementsToReset = [
        'clt-gross', 'clt-discounts', 'clt-benefits', 'clt-liquid',
        'pj-gross', 'pj-tax', 'pj-liquid',
        'employer-inss', 'employer-other', 'employer-total',
        'detail-salary', 'detail-inss', 'detail-ir-base', 'detail-ir',
        'detail-fgts', 'detail-vacation', 'detail-13'
    ];

    elementsToReset.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = formatCurrency(0);
        }
    });

    // Reseta regime tributário para Simples Nacional
    document.querySelectorAll('[data-regime]').forEach(card => {
        if (card.dataset.regime === 'simples') {
            card.click();
        }
    });

    // Limpa mensagens de erro
    document.getElementById('error-message').textContent = '';
}

// Submit do formulário
form.addEventListener('submit', function(e) {
    e.preventDefault();

    if (!validateForm()) return;

    const cltSalary = currencyToNumber(document.getElementById('clt-salary').value);
    const dependents = parseInt(document.getElementById('dependents').value) || 0;
    const taxRate = parseFloat(document.getElementById('tax-rate').value) / 100;

    // Calcula benefícios
    let taxableBenefits = 0;
    let nonTaxableBenefits = 0;
    benefits.forEach(benefit => {
        if (benefit.taxable) {
            taxableBenefits += benefit.value;
        } else {
            nonTaxableBenefits += benefit.value;
        }
    });

    // Base para INSS e IR
    const baseForTaxes = cltSalary + taxableBenefits;
    const inss = calculateINSS(baseForTaxes);
    const irBase = baseForTaxes - inss - (dependents * 189.59);
    const ir = calculateIR(irBase, dependents);

    // Cálculos CLT
    const fgts = cltSalary * 0.08;
    const vacation = cltSalary / 3;
    const thirteenth = cltSalary;
    const cltLiquid = baseForTaxes + nonTaxableBenefits - inss - ir;

    // Cálculos PJ
    const pjMonthly = cltSalary * 1.3 + taxableBenefits + nonTaxableBenefits; // 30% adicional
    const pjTax = pjMonthly * taxRate;
    const pjLiquid = pjMonthly - pjTax;

    // Custos do empregador
    const employerInss = cltSalary * EMPLOYER_CHARGES.inss;
    const employerOther = cltSalary * (EMPLOYER_CHARGES.rat + EMPLOYER_CHARGES.others);
    const employerTotal = cltSalary + employerInss + employerOther + 
                         (thirteenth / 12) + (vacation / 12) + 
                         taxableBenefits + nonTaxableBenefits;

    // Atualiza resultados
    updateResults({
        cltSalary,
        inss,
        ir,
        irBase,
        fgts,
        vacation,
        thirteenth,
        cltLiquid,
        pjMonthly,
        pjTax,
        pjLiquid,
        taxableBenefits,
        nonTaxableBenefits,
        employerTotal
    });
});

// Inicialização
document.querySelector('[data-tab="summary"]').click();