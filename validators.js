

function validateEmail(email) {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email);
}

function validateCpf(cpf) {
    if (!cpf) {
        return true; // CPF é opcional
    }
    // Remove caracteres não numéricos
    cpf = cpf.replace(/\D/g, "");
    return cpf.length === 11;
}

module.exports = { validateEmail, validateCpf };

