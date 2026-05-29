import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();
    const state = mongoose.connection.readyState;
    const states: Record<number, string> = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    return Response.json({
      ok: true,
      status: states[state] ?? "unknown",
      database: mongoose.connection.name,
      host: mongoose.connection.host,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Không kết nối được MongoDB";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
