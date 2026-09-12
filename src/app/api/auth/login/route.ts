import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyPassword, createSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
      //   return NextResponse.json(
      //   { error: parsed.error.issues[0].message },
      //   { status: 400 }
      // );
    }

    const { email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    await createSession(user.id);

    return NextResponse.json({ id: user.id, email: user.email }, { status: 200 });
  } catch (err) {
    console.error("Error in login route:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}