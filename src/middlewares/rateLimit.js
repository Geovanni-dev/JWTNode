const rateLimit = require('express-rate-limit');// importando o express-rate-limit

const blockedIps = {}; // objeto para armazenar os IPs bloqueados

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 10, // limite de 5 requisicoes por minuto
    handler: (req, res) => {
        const ip = req.ip;
        const now = Date.now();

        if (blockedIps[ip]    && now < blockedIps[ip]) { // se o IP estiver bloqueado
            const secondsLeft = (blockedIps[ip] - now) / 1000; // tempo restante de bloqueio
            return res.status(429).json({
                error: "Ainda estamos bloqueando esse IP. Por favor, tente novamente mais tarde."});
            }
        
        blockedIps[ip] = now + ( 10 * 60 * 1000); // tempo de bloqueio de 10 minutos

        return res.status(429).json({ error: "Muitas tentativas frequentes de login. Por favor, tente novamente mais tarde." });
    }
});

module.exports = {  limiter };
