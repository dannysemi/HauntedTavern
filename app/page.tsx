'use client';

import { useChat, type Message } from 'ai/react';
import { useState, useRef } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface MarkdownComponentProps {
  node?: any;
  children?: React.ReactNode;
  [key: string]: any;
}

function Message({
  message,
  userName,
  assistantName,
  isEditing,
  editContent,
  onEditChange,
  onSave,
  onDelete,
  onEdit
}: {
  message: Message;
  userName: string;
  assistantName: string;
  isEditing: boolean;
  editContent: string;
  onEditChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSave: () => void;
  onDelete: () => void;
  onEdit: () => void;
}) {
          const { text, reasoning } = parseContent(
            typeof message.content === 'string'
              ? message.content
              : JSON.stringify(message.content)
          );

  if (isEditing) {
          return (
      <div className="relative mb-4">
                    <textarea
                      value={editContent}
          onChange={onEditChange}
                      className="w-full p-2 rounded bg-[#3a2020] text-[#e8d5b5] border border-[#5c2d2d] focus:outline-none focus:ring-1 focus:ring-[#8a4b4b]"
                      rows={4}
                    />
          <button
          onClick={onSave}
                      className="mt-2 px-3 py-1 bg-[#5c2d2d] text-[#e8c8a0] rounded hover:bg-[#8a4b4b] transition-colors"
          >
                      Save
          </button>
    </div>
                          );
  }

  return (
    <div className="group relative mb-4">
      <div className="text-sm font-medium mb-1 text-[#d4a76a] font-serif">
        {message.role === 'user' ? userName : assistantName}
        </div>

      <div className="prose prose-sm prose-invert text-[#e8d5b5]">
        <ReactMarkdown components={markdownComponents}>{text}</ReactMarkdown>
    </div>

      {(message.role === 'user' || message.role === 'assistant') && (
        <div className="absolute -bottom-2 -right-0 flex gap-1">
          <button
            onClick={onEdit}
            className="p-1 text-[#d4a76a] opacity-0 group-hover:opacity-100 transition-opacity"
                      >
            <PencilSquareIcon className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-[#c49c6b] opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#d4a76a]"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
    </div>
      )}

      {reasoning && (
        <details className="mt-2">
          <summary className="text-sm text-[#c49c6b] cursor-pointer hover:text-[#d4a76a] font-serif">
            Whispered Thoughts
          </summary>
          <div className="mt-2 p-2 bg-[#3a2020] rounded prose prose-sm prose-invert text-[#d4b58c]">
            <ReactMarkdown components={markdownComponents}>{reasoning}</ReactMarkdown>
          </div>
        </details>
      )}
    </div>
  );
}

const markdownComponents: Components = {
  em: ({ node, ...props }: MarkdownComponentProps) =>
    <em className="text-[#757575]" {...props} />,
  strong: ({ node, ...props }: MarkdownComponentProps) =>
    <strong className="text-[#c49c6b]" {...props} />,

  blockquote: ({ node, ...props }: MarkdownComponentProps) => (
    <blockquote className="border-l-4 border-[#d4a76a] bg-[#3a2020]/50 pl-4 py-1 italic" {...props} />
  ),

  p: ({ node, ...props }: MarkdownComponentProps) => {
    const content = React.Children.toArray(props.children).join('').trim();
    const isQuoted = content.startsWith('"') && content.endsWith('"');
    return isQuoted
      ? <p className="text-[#d4a76a] font-medium" {...props} />
      : <p {...props} />;
  }
};

function parseContent(content: string) {
  const thinkTagMatch = content.match(/<think>([\s\S]*?)<\/think>/);
  if (thinkTagMatch && thinkTagMatch[1]) {
    return {
      text: content.replace(/<think>[\s\S]*?<\/think>/, '').trim(),
      reasoning: thinkTagMatch[1].trim(),
    };
  }
  return { text: content.trim() };
}

export default function Page() {
  const userName = process.env.NEXT_PUBLIC_USER_NAME || "Traveler";
  const assistantName = process.env.NEXT_PUBLIC_ASSISTANT_NAME || "Tavern Keeper";

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: isPending,
    setMessages
  } = useChat({
    api: '/api/chat',
    onResponse: (response) => {
      console.log('Raw response received:', response);
    },
    onFinish: (message) => {
      scrollToBottom();
      console.log('Final message:', message);
    },
    onError: (error) => {
      console.error('Chat error:', error);
    }
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSaveEdit = async (index: number) => {
    const newMessages = [...messages];
    newMessages[index].content = editContent;
    setMessages(newMessages);
    setEditingId(null);
    setEditContent('');
  };

  const handleDeleteMessage = (indexToDelete: number) => {
    setMessages(messages.filter((_, index) => index !== indexToDelete));
  };

  const handleStartEdit = (index: number, content: string) => {
    setEditingId(index);
    setEditContent(content);
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-[#221818]">
      <header className="sticky top-0 z-10 p-4 border-b border-[#5c2d2d] bg-[#2a1414]">
        <h1 className="text-xl font-medium text-[#e8c8a0] font-serif tracking-wider">Haunted Tavern</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-4 min-h-0 scrollbar scrollbar-thumb-[#5c2d2d] scrollbar-track-[#2a1414] scrollbar-w-2">
        <div className="space-y-6 pt-4">
          {messages.map((message, index) => (
            <Message
              key={index}
              message={message}
              userName={userName}
              assistantName={assistantName}
              isEditing={editingId === index}
              editContent={editContent}
              onEditChange={(e) => setEditContent(e.target.value)}
              onSave={() => handleSaveEdit(index)}
              onDelete={() => handleDeleteMessage(index)}
              onEdit={() => handleStartEdit(index, typeof message.content === 'string' ? message.content : JSON.stringify(message.content))}
            />
          ))}
          <div ref={messagesEndRef} />
          {isPending && (
            <div className="mt-4 text-sm text-[#c49c6b] font-serif italic">
              {assistantName} is pondering...
            </div>
          )}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 z-10 p-4 border-t border-[#5c2d2d] bg-[#2a1414]"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Speak your mind..."
            className="flex-1 p-3 rounded bg-[#3a2020] text-[#e8d5b5] border border-[#5c2d2d] focus:outline-none focus:ring-1 focus:ring-[#8a4b4b] placeholder-[#5c2d2d]/70"
            disabled={isPending}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#5c2d2d] text-[#e8c8a0] rounded hover:bg-[#8a4b4b] disabled:bg-[#3a2020] disabled:text-[#5c2d2d] transition-colors"
            disabled={isPending || !input.trim()}
          >
            Say
          </button>
        </div>
      </form>
    </div>
  );
}
