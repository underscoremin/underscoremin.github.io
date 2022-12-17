function loadMermaid() {
  mermaid.init(
    {
      startOnLoad: true,
      theme: 'monokai',
    },
    'pre code.language-mermaid',
  );
};
