'use client';
import React from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';

interface MarkdownComponentProps {
  node?: any;
  children?: React.ReactNode;
  [key: string]: any;
}

export const markdownComponents: Components = {
  em: ({ node, ...props }: MarkdownComponentProps) => (
    <em className="text-[#757575]" {...props} />
  ),
  strong: ({ node, ...props }: MarkdownComponentProps) => (
    <strong className="text-[#c49c6b]" {...props} />
  ),
  blockquote: ({ node, ...props }: MarkdownComponentProps) => (
    <blockquote className="border-l-4 border-[#d4a76a] bg-[#3a2020]/50 pl-4 py-1 italic" {...props} />
  ),
  p: ({ node, ...props }: MarkdownComponentProps) => {
    const content = React.Children.toArray(props.children).join('').trim();
    const isQuoted = content.startsWith('"') && content.endsWith('"');
    return isQuoted ? (
      <p className="text-[#d4a76a] font-medium" {...props} />
    ) : (
      <p {...props} />
    );
  }
};

export function parseContent(content: string) {
  const thinkTagMatch = content.match(/<think>([\s\S]*?)<\/think>/);
  if (thinkTagMatch && thinkTagMatch[1]) {
    return {
      text: content.replace(/<think>[\s\S]*?<\/think>/, '').trim(),
      reasoning: thinkTagMatch[1].trim(),
    };
  }
  return { text: content.trim() };
}