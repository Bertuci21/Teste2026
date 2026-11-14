// 1. Referências dos elementos HTML
const formulario = document.getElementById('cep-form');
const campoCep = document.getElementById('cep');
const mensagem = document.getElementById('mensagem');
const resultado = document.getElementById('resultado');

// 2. Evento de envio (Enter) com função assíncrona
form.addEventListener('submit', async (event) => {
    // 3. Impede o recarregamento da página
    event.preventDefault();

    // 4. Oculta resultados de consultas anteriores
    resultado.hidden = true;

    // 5. Lê o CEP, removendo espaços do início e do fim
    const cep = campoCep.value.trim();

    // 6. Valida o formato
    if (!/^\d{5}-?\d{3}$/.test(cep)) {
        mensagem.textContent = 'CEP inválido. Digite 12328070 ou 12328-070.';
        return;
    }

    try {
        // 7. Informa o início da consulta
        mensagem.textContent = 'Consultando...';
        campoCep.disabled = true;

        // 8. Remove o hífen
        const cepLimpo = cep.replace('-', '');

        // 9. Requisição ao ViaCEP
        const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);

        // 10. Verifica sucesso HTTP
        if (!resposta.ok) {
            mensagem.textContent = `Erro do serviço: ${resposta.status} ${resposta.statusText}`.trim();
            return;
        }

        // 11. Converte para JSON
        const dados = await resposta.json();

        // 12. Verifica se o CEP foi encontrado
        if (dados.erro) {
            mensagem.textContent = 'CEP não encontrado.';
            return;
        }

        // 13. Preenche os resultados
        document.getElementById('valor-cep').textContent = dados.cep;
        document.getElementById('valor-logradouro').textContent = dados.logradouro || 'Não informado';
        document.getElementById('valor-bairro').textContent = dados.bairro || 'Não informado';
        document.getElementById('valor-cidade').textContent = dados.localidade;
        document.getElementById('valor-uf').textContent = dados.uf;
        document.getElementById('valor-ibge').textContent = dados.ibge;

        // 14. Exibe os resultados
        resultado.hidden = false;
        mensagem.textContent = 'Resposta do ViaCEP:';
    } catch (erro) {
        // 15. Falha de comunicação ou processamento
        mensagem.textContent = 'Falha de conexão. Tente novamente.';
    } finally {
        // 16. Reabilita o campo e devolve o foco
        campoCep.disabled = false;
        campoCep.focus();
    }
});
