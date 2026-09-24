import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    // Built-in verified demo accounts for quick role-based evaluation & MVP presentation
    let userRole = role || "member";
    let userName = "Urhobo Member";
    let chapterId: string | null = "c-houston";
    let chapterName = "UPA Houston";

    const cleanEmail = (email || "").toLowerCase().trim();

    if (cleanEmail === "admin@upuamerica.org" || role === "admin") {
      userRole = "admin";
      userName = "Chief Samuel Ogaga (President)";
      chapterId = null;
      chapterName = "National Secretariat";
    } else if (cleanEmail.includes("chapter") || cleanEmail === "chapter.houston@upuamerica.org" || role === "chapter") {
      userRole = "chapter";
      userName = "Chief Godspower Oniovosa (Houston President)";
      chapterId = "c-houston";
      chapterName = "UPA Houston";
    } else {
      userRole = "member";
      userName = cleanEmail ? cleanEmail.split("@")[0].replace(".", " ") : "Efe Okagbare";
      chapterId = "c-houston";
      chapterName = "UPA Houston";
    }

    return NextResponse.json({
      success: true,
      user: {
        id: `u-${Date.now()}`,
        email: cleanEmail || `${userRole}@upuamerica.org`,
        name: userName,
        role: userRole,
        chapterId,
        chapterName,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Invalid request payload" }, { status: 400 });
  }
}
