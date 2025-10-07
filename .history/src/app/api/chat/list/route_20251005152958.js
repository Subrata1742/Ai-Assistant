import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
   const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const chats = await prisma.chat.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return Response.json(chats);
}
