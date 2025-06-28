// Simple code component without syntax highlighting
const Code = ({ children, language }) => {
  return (
    <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
      <code className={language ? `language-${language}` : ''}>
        {children}
      </code>
    </pre>
  );
};

export default Code;