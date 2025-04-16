import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db-connect";
import Review from "@/lib/models/review.model";
import { auth } from "@clerk/nextjs/server";

export async function DELETE(
  request: Request,
  { params }: { params: { reviewId: string } }
) {
  try {
    await connectToDatabase();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    const review = await Review.findById(params.reviewId);

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Check if the user is the owner of the review
    if (review.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized - You can only delete your own reviews" },
        { status: 403 }
      );
    }

    await Review.findByIdAndDelete(params.reviewId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
