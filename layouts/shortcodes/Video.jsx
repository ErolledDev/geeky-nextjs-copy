// Simple video component
function Video({ title, width = "100%", height = "auto", src, ...rest }) {
  if (!src) return null;
  
  return (
    <video
      className="overflow-hidden rounded w-full"
      width={width}
      height={height}
      controls
      {...rest}
    >
      <source
        src={src.match(/^http/) ? src : `/videos/${src}`}
        type="video/mp4"
      />
      {title && <p>{title}</p>}
    </video>
  );
}

export default Video;