import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ContactPayload;

    const name = payload.name?.trim() || "";
    const email = payload.email?.trim() || "";
    const phone = payload.phone?.trim() || "";
    const message = payload.message?.trim() || "";

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { success: false, error: "All fields are required." },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    await db.collection("contact_submissions").insertOne({
      name,
      email,
      phone,
      message,
      createdAt: new Date()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact submit error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save contact form. Please try again." },
      { status: 500 }
    );
  }
}
