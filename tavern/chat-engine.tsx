'use client';
import { useChat } from 'ai/react';
import { useState, useRef } from 'react';
import { useLLMParams, type LLMParams } from './curios/llm-params-menu';

export function useChatEngine() {
  const { params: llmParams, isOpen, toggleMenu } = useLLMParams();
  const chat = useChat({
    api: '/api/chat',
    body: {
      llmParams // Pass params directly to API calls
    }
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const handleSaveEdit = (index: number) => {
    const newMessages = [...chat.messages];
    newMessages[index].content = editContent;
    chat.setMessages(newMessages);
    setEditingId(null);
  };

  const handleDeleteMessage = (index: number) => {
    chat.setMessages(chat.messages.filter((_, i) => i !== index));
  };

  const handleStartEdit = (index: number, content: string) => {
    setEditingId(index);
    setEditContent(content);
  };

  return {
    ...chat,
    llmParams,
    isParamsMenuOpen: isOpen,
    toggleParamsMenu: toggleMenu,
    editingId,
    editContent,
    messagesEndRef,
    scrollToBottom,
    handleSaveEdit,
    handleDeleteMessage,
    handleStartEdit
  };
}