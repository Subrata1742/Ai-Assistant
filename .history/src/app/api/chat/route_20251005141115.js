import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST() {
  const user = await getAuthUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const chat = await prisma.chat.create({
    data: { userId: user.id, title: "New Chat" },
  });

  return Response.json(chat);
}
