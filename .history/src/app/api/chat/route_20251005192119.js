import prisma from "@/lib/prisma";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const chat = await prisma.chat.create({
    data: { userId: session.user.id, title: session.user.id },
  });

  return Response.json(chat);
}
