import prismaClient from "../../prisma";
import { sign } from "jsonwebtoken";
import { compare } from 'bcryptjs' // Compara a senha criptografada no banco com a senha digitada pelo usuário

interface AuthRequest {
    email: string;
    password: string;
}

export const authUserService = async ({ email, password }: AuthRequest) => {
    //  Verifica se o email existe no banco
    const user = await prismaClient.user.findFirst({
        where: { email }
    });

    if (!user) {
        throw new Error("User/password incorrect");
    }

    //  Verifica se a senha está correta
    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
        throw new Error("User/password incorrect");
    }

    //  Se email e senha estiverem corretos, cria um token JWT
    const token = sign(
        {
            name: user.name,
            email: user.email
        },
        process.env.JWT_SECRET as string, // Chave secreta para gerar o token (vem do `.env`)
        {
            subject: user.id, // O ID do usuário será armazenado no token
            expiresIn: "30d" // Token válido por 30 dias
        }
    );

    // 4️⃣ Retorna as informações do usuário e o token JWT
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        token
    };
};
