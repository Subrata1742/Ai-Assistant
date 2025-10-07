import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: Request, { params }) {
  const user = await getAuthUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { chatId } = params;

  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!chat || chat.userId !== user.id) {
    return new Response("Not found", { status: 404 });
  }

  return Response.json(chat);
}
