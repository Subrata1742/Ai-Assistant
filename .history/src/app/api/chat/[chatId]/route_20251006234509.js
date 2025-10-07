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
export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { chatId } = await params;

  // First, verify the chat belongs to the user
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
  });

  if (!chat || chat.userId !== session.user.id) {
    return new Response("Not found or unauthorized", { status: 404 });
  }

  // Delete the chat
  await prisma.chat.delete({
    where: { id: chatId },
  });

  return Response.json({ message: "Chat deleted successfully" });
}