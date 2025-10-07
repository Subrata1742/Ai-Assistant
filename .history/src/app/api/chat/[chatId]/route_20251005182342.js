import  prisma  from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req , { params }) {
   const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { chatId } = await params;

  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!chat || chat.userId !== session.user.id) {
    return new Response("Not found", { status: 404 });
  }

  return Response.json(chat);
}
