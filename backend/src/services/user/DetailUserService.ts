import prismaClient from "../../prisma";

class DetailUserService{
  async execute(user_id: string){
    const user = await prismaClient.user.findFirst({
      where:{
        id: user_id
      },
      select:{ //select eu uso para devolver algo oq eu quero no insomnia
        id: true,
        name: true,
        email: true,
      }
    })
    return user
  }
}

export { DetailUserService }