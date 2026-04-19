import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Request from "@/models/Request";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    // Get category counts
    const categoryStats = await Request.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get most common category
    const topCategory = categoryStats[0]?._id || "Web Development";

    // Get high urgency count
    const highUrgencyCount = await Request.countDocuments({ urgency: "High", status: "Open" });

    // Get trusted helpers count (users with trust score >= 80)
    const trustedHelpersCount = await User.countDocuments({ trustScore: { $gte: 80 } });

    // Get requests needing attention (high urgency, open status)
    const requestsNeedingAttention = await Request.find({
      status: "Open",
      urgency: { $in: ["High", "Medium"] }
    })
      .populate("requester", "name location")
      .sort({ createdAt: -1 })
      .limit(5);

    // Get trending tags
    const tagStats = await Request.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    return NextResponse.json({
      topCategory,
      highUrgencyCount,
      trustedHelpersCount,
      requestsNeedingAttention,
      trendingTags: tagStats.map(t => t._id),
      categoryDistribution: categoryStats
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
