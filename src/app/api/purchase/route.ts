import { verifyBurn, verifyPayment } from "@/services/auth";
import { incrementUserCredits } from "@/services/users";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const credits = (await req.json()).credits || 5;
    const userAddress = req.headers.get("x-user-address");
    if (!userAddress) {
      return NextResponse.json(
        {
          error: "Missing user address in headers.",
        },
        { status: 400 }
      );
    }

    // Verify signature of burn
    const signature = req.headers.get("x-signature");
    const payVia = req.headers.get("x-pay-via");
    if (payVia === "bonk") {
      await verifyBurn(signature, credits);
    } else {
      await verifyPayment(signature, credits);
    }

    await incrementUserCredits(userAddress, credits);
    return NextResponse.json(
      {
        message: "Credits added successfully.",
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.log(err);
    return NextResponse.json(
      {
        error: err.message || "An error occurred while processing the request.",
      },
      { status: err.status || 500 }
    );
  }
}
