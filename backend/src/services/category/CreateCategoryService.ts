import prismaClient from "../../prisma";

interface CategoryRequest{
    name: string;
}

class CreateCategoryService{
    async execute({name}: CategoryRequest){
        if(name === ''){
            throw new Error('Nome da categoria é obrigatório');
        }
        const category = await prismaClient.category.create({
            data:{
                name,
            },
            select:{
                id: true, //id categoria
                name: true, //id name categoria
            }
        });
        return category
    }
}

export { CreateCategoryService}