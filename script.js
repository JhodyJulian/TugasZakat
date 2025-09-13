// Progress bar functionality
window.onscroll = function() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById("progressBar").style.width = scrolled + "%";
};

// Mobile menu toggle
document.getElementById('mobileMenuBtn').addEventListener('click', function() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
});

// Tab switching functionality
const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs and contents
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Show corresponding content
        const tabId = tab.getAttribute('data-tab');
        document.getElementById(`${tabId}-content`).classList.add('active');
    });
});

// Toggle FAQ items
function toggleFaq(element) {
    const faqItem = element.parentElement;
    faqItem.classList.toggle('active');
}

// Change Zakat Mal type inputs
function changeMalType() {
    const malType = document.getElementById('malType').value;
    const malInputs = document.querySelectorAll('.mal-type');
    
    // Hide all input groups
    malInputs.forEach(input => {
        input.classList.remove('active');
    });
    
    // Show selected input group
    document.getElementById(`${malType}-inputs`).classList.add('active');
}

// Calculate Zakat Fitrah
function calculateFitrah() {
    const familyMembers = parseInt(document.getElementById('familyMembers').value) || 0;
    const ricePrice = parseInt(document.getElementById('ricePrice').value) || 0;
    
    // Zakat fitrah is 2.5 kg of rice per person
    const zakatPerPerson = 2.5 * ricePrice;
    const totalZakat = familyMembers * zakatPerPerson;
    
    // Format to Indonesian Rupiah
    const formattedZakat = formatRupiah(totalZakat);
    
    // Display result
    document.getElementById('fitrahTotal').textContent = `Rp ${formattedZakat}`;
    document.getElementById('fitrahDetail').textContent = `${familyMembers} orang x 2.5 kg x Rp ${formatRupiah(ricePrice)}`;
    
    // Show result
    document.getElementById('fitrahResult').style.display = 'block';
}

// Calculate Zakat Mal
function calculateMal() {
    const malType = document.getElementById('malType').value;
    const debts = parseInt(document.getElementById('debts').value) || 0;
    const goldPriceGram = parseInt(document.getElementById('goldPriceGram').value) || 0;
    
    let totalWealth = 0;
    
    // Calculate based on selected mal type
    if (malType === 'money') {
        const savings = parseInt(document.getElementById('savings').value) || 0;
        const otherMoney = parseInt(document.getElementById('otherMoney').value) || 0;
        totalWealth = savings + otherMoney;
    } else if (malType === 'gold') {
        const goldWeight = parseFloat(document.getElementById('goldWeight').value) || 0;
        const silverWeight = parseFloat(document.getElementById('silverWeight').value) || 0;
        const silverPriceGram = parseInt(document.getElementById('silverPriceGram').value) || 0;
        
        totalWealth = (goldWeight * goldPriceGram) + (silverWeight * silverPriceGram);
    } else if (malType === 'agriculture') {
        const cropAmount = parseInt(document.getElementById('cropAmount').value) || 0;
        const irrigationType = document.getElementById('irrigationType').value;
        const cropType = document.getElementById('cropType').value;
        
        // For simplicity, we'll assume a fixed price per kg
        let cropPrice = 10000; // Default price for other crops
        
        if (cropType === 'rice') cropPrice = 15000;
        else if (cropType === 'corn') cropPrice = 8000;
        else if (cropType === 'wheat') cropPrice = 12000;
        
        totalWealth = cropAmount * cropPrice;
        
        // For agriculture, zakat is calculated differently
        const zakatPercentage = irrigationType === 'rain' ? 0.1 : 0.05;
        const zakatableWealth = totalWealth;
        const zakatAmount = zakatableWealth * zakatPercentage;
        
        // Display result
        document.getElementById('nisab').textContent = "Tidak berlaku untuk pertanian";
        document.getElementById('totalWealth').textContent = `Rp ${formatRupiah(totalWealth)}`;
        document.getElementById('zakatableWealth').textContent = `Rp ${formatRupiah(zakatableWealth)}`;
        document.getElementById('malTotal').textContent = `Rp ${formatRupiah(zakatAmount)}`;
        
        // Show result
        document.getElementById('malResult').style.display = 'block';
        document.getElementById('noZakatMessage').style.display = 'none';
        
        return;
    } else if (malType === 'livestock') {
        const livestockCount = parseInt(document.getElementById('livestockCount').value) || 0;
        const livestockType = document.getElementById('livestockType').value;
        
        // For simplicity, we'll assume average prices
        let animalPrice = 0;
        
        if (livestockType === 'cow') animalPrice = 10000000;
        else if (livestockType === 'goat') animalPrice = 2000000;
        else if (livestockType === 'poultry') animalPrice = 50000;
        
        totalWealth = livestockCount * animalPrice;
    } else if (malType === 'trade') {
        const businessAssets = parseInt(document.getElementById('businessAssets').value) || 0;
        const businessProfit = parseInt(document.getElementById('businessProfit').value) || 0;
        const businessDebts = parseInt(document.getElementById('businessDebts').value) || 0;
        
        totalWealth = businessAssets + businessProfit - businessDebts;
    }
    
    // Calculate nisab (85 grams of gold)
    const nisab = 85 * goldPriceGram;
    
    // Subtract debts
    const zakatableWealth = Math.max(0, totalWealth - debts);
    
    // Check if wealth reaches nisab
    if (zakatableWealth >= nisab) {
        const zakatAmount = zakatableWealth * 0.025;
        
        // Display result
        document.getElementById('nisab').textContent = `Rp ${formatRupiah(nisab)}`;
        document.getElementById('totalWealth').textContent = `Rp ${formatRupiah(totalWealth)}`;
        document.getElementById('zakatableWealth').textContent = `Rp ${formatRupiah(zakatableWealth)}`;
        document.getElementById('malTotal').textContent = `Rp ${formatRupiah(zakatAmount)}`;
        
        // Show result
        document.getElementById('malResult').style.display = 'block';
        document.getElementById('noZakatMessage').style.display = 'none';
    } else {
        // Display message that zakat is not obligatory
        document.getElementById('nisab').textContent = `Rp ${formatRupiah(nisab)}`;
        document.getElementById('totalWealth').textContent = `Rp ${formatRupiah(totalWealth)}`;
        document.getElementById('zakatableWealth').textContent = `Rp ${formatRupiah(zakatableWealth)}`;
        document.getElementById('malTotal').textContent = `Rp 0`;
        
        // Show message
        document.getElementById('malResult').style.display = 'block';
        document.getElementById('noZakatMessage').style.display = 'block';
    }
}

// Calculate Zakat Profesi
function calculateProfesi() {
    const monthlyIncome = parseInt(document.getElementById('monthlyIncome').value) || 0;
    const otherIncome = parseInt(document.getElementById('otherIncome').value) || 0;
    const monthlyExpenses = parseInt(document.getElementById('monthlyExpenses').value) || 0;
    const goldPrice = parseInt(document.getElementById('goldPrice').value) || 0;
    
    // Calculate net income
    const netIncome = Math.max(0, monthlyIncome + otherIncome - monthlyExpenses);
    
    // Calculate annual net income
    const annualNetIncome = netIncome * 12;
    
    // Calculate nisab (85 grams of gold)
    const nisab = 85 * goldPrice;
    
    // Check if income reaches nisab
    if (annualNetIncome >= nisab) {
        const zakatAmount = netIncome * 0.025;
        
        // Display result
        document.getElementById('profesiNisab').textContent = `Rp ${formatRupiah(nisab)}`;
        document.getElementById('netIncome').textContent = `Rp ${formatRupiah(netIncome)}`;
        document.getElementById('profesiTotal').textContent = `Rp ${formatRupiah(zakatAmount)}`;
        
        // Show result
        document.getElementById('profesiResult').style.display = 'block';
        document.getElementById('noProfesiZakatMessage').style.display = 'none';
    } else {
        // Display message that zakat is not obligatory
        document.getElementById('profesiNisab').textContent = `Rp ${formatRupiah(nisab)}`;
        document.getElementById('netIncome').textContent = `Rp ${formatRupiah(netIncome)}`;
        document.getElementById('profesiTotal').textContent = `Rp 0`;
        
        // Show message
        document.getElementById('profesiResult').style.display = 'block';
        document.getElementById('noProfesiZakatMessage').style.display = 'block';
    }
}

// Format number to Indonesian Rupiah
function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID').format(amount);
}

// Save calculation
function saveCalculation(type) {
    alert(`Perhitungan zakat ${type} telah disimpan.`);
    // In a real application, you would save to local storage or a database
}

// Print calculation
function printCalculation(type) {
    alert(`Mencetak perhitungan zakat ${type}.`);
    // In a real application, you would open a print dialog
}

// Reset form
function resetForm(type) {
    if (type === 'fitrah') {
        document.getElementById('familyMembers').value = 1;
        document.getElementById('ricePrice').value = 15000;
        document.getElementById('fitrahResult').style.display = 'none';
    } else if (type === 'mal') {
        const inputs = document.querySelectorAll('#mal-content input');
        inputs.forEach(input => {
            if (input.id === 'goldPriceGram') {
                input.value = 1000000;
            } else if (input.id === 'silverPriceGram') {
                input.value = 12000;
            } else {
                input.value = 0;
            }
        });
        document.getElementById('malResult').style.display = 'none';
    } else if (type === 'profesi') {
        document.getElementById('monthlyIncome').value = 0;
        document.getElementById('otherIncome').value = 0;
        document.getElementById('monthlyExpenses').value = 0;
        document.getElementById('goldPrice').value = 1000000;
        document.getElementById('profesiResult').style.display = 'none';
    }
}

// Send contact message
function sendMessage() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    if (name && email && message) {
        alert('Pesan Anda telah terkirim. Terima kasih!');
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('message').value = '';
    } else {
        alert('Harap isi semua field yang diperlukan.');
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer if needed
    const yearElement = document.querySelector('.footer-bottom p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = yearElement.textContent.replace('2023', currentYear);
    }
    
    // Initialize mal type
    changeMalType();
});
