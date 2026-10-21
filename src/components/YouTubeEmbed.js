import { toYouTubeEmbedUrl } from "@/lib/youtube";

export default function YouTubeEmbed({ url, title = "Project video" }) {
  const embedUrl = toYouTubeEmbedUrl(url);
  if (!embedUrl) return null;

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-[#1a1a1a]">
      <iframe
        src={embedUrl}
        title={title}
        className="absolute inset-0 h-full w-full"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
