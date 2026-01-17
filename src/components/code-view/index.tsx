import Prism from "prismjs";
import { useEffect, useRef } from "react";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";

import "./code-theme.css";

interface Props {
  code: string;
  language: string;
}

export const CodeView = ({ code, language }: Props) => {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code]);

  return (
    <pre className="p-2 bg-transparent border-none rounded-none m-0 text-xs">
      <code className={`language-${language}`} ref={codeRef}>{code}</code>
    </pre>
  )
}