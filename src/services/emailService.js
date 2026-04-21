const nodemailer = require("nodemailer");

//================================= funçoes de servico de email

// funçao para gerar um codigo de verificacao aleatorio de 6 caracteres
function generateVerificationCode() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // caracteres permitidos no codigo de verificacao
    let code = ""; // codigo de verificacao gerado aleatoriamente
    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length)); // adiciona um caractere aleatorio ao codigo de verificacao
    }
    return code;
}

// funçao de transport
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST, // host do servidor de email, definido na variavel de ambiente MAIL_HOST
    port: process.env.MAIL_PORT, // porta do servidor de email, definida na variavel de ambiente MAIL_PORT
    secure: true, // indica que a conexao deve ser segura SSL/TLS
    auth: {
        user: process.env.MAIL_USER, // usuario do servidor de email, definido na variavel de ambiente MAIL_USER
        pass: process.env.MAIL_PASS // senha do servidor de email, definida na variavel de ambiente MAIL_PASS
    }
});     

// funçao assincrona para enviar um email de verificacao
const emailCode = async (email, subject, message) => {
    try {
        await transporter.sendMail({
            from: ` "Teste de Email" <${process.env.MAIL_USER}>`, // remetente do email, definido pela variavel de ambiente MAIL_USER
            to: email, // destinatario do email, definido pelo parametro email
            subject: subject, // assunto do email, definido pelo parametro subject
            text: message // corpo do email, definido pelo parametro message
        });
        console.log("Email enviado com sucesso para:", email);
        return true; 
    } catch (error) {
        console.error("Erro ao enviar email:", error); // loga o erro caso ocorra algum problema ao enviar o email
        throw error; // deixa o controller lidar com o erro
    }
};


module.exports = { // exportando as funcoes
    emailCode,
    generateVerificationCode
};