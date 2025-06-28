// Simple YouTube component without external dependencies
const Youtube = ({ id, title, ...rest }) => {
  if (!id) return null;
  
  return (
    <div className="overflow-hidden rounded">
      <iframe
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${id}`}
        title={title || "YouTube video"}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full aspect-video"
        {...rest}
      />
    </div>
  );
};

export default Youtube;