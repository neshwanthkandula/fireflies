
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import  prisma  from "@/lib/prisma";

export const runtime = "nodejs"; // REQUIRED for Prisma

export async function POST(req: Request) {
  console.log("Webhook called");

  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return new NextResponse("Webhook secret not configured", { status: 500 });
  }

  const payload = await req.text();

  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new NextResponse("Missing Svix headers", { status: 400 });
  }

  let event: any;

  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const { type, data } = event;

  if (type === "user.created") {
    console.log("User created:", data.id);

    const primaryEmail = data.email_addresses?.find(
      (email: any) => email.id === data.primary_email_address_id
    )?.email_address;

    const user = await prisma.user.create({
      data: {
        id : data.id,
        clerkId: data.id,
        email: primaryEmail,
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
      },
    });

    console.log("User stored in DB:", user);

    return NextResponse.json({ success: true });
  }

  console.log("Unhandled event:", type);
  return NextResponse.json(
    { message: "Unhandled webhook event" },
    { status: 200 }
  );
}
