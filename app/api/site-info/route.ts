import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const urlObj = new URL(url);
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch page");
    }

    const html = await response.text();
    
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "";

    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
    const ogTitle = ogTitleMatch ? ogTitleMatch[1] : "";

    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    const description = descMatch ? descMatch[1] : "";

    const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
    const ogDescription = ogDescMatch ? ogDescMatch[1] : "";

    const iconMatch = html.match(/<link[^>]*rel=["'](?:icon|shortcut icon)["'][^>]*href=["']([^"']+)["']/i);
    const icon = iconMatch ? iconMatch[1] : "";

    const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
    const ogImage = ogImageMatch ? ogImageMatch[1] : "";

    let faviconUrl = "";
    if (icon) {
      if (icon.startsWith("//")) {
        faviconUrl = `https:${icon}`;
      } else if (icon.startsWith("/")) {
        faviconUrl = `${urlObj.origin}${icon}`;
      } else if (icon.startsWith("http")) {
        faviconUrl = icon;
      } else {
        faviconUrl = `${urlObj.origin}/${icon}`;
      }
    } else {
      faviconUrl = `${urlObj.origin}/favicon.ico`;
    }

    const siteName = ogTitle || title || urlObj.hostname;
    const siteDescription = ogDescription || description || "";
    const siteAvatar = ogImage || faviconUrl;

    return NextResponse.json({
      success: true,
      data: {
        name: siteName,
        description: siteDescription,
        avatar: siteAvatar,
        favicon: faviconUrl,
      },
    });
  } catch (error) {
    console.error("Failed to fetch site info:", error);
    
    try {
      const urlObj = new URL(url);
      return NextResponse.json({
        success: true,
        data: {
          name: urlObj.hostname.replace("www.", ""),
          description: "",
          avatar: `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`,
          favicon: `${urlObj.origin}/favicon.ico`,
        },
      });
    } catch {
      return NextResponse.json({ 
        success: false, 
        error: "Failed to fetch site info" 
      }, { status: 500 });
    }
  }
}
