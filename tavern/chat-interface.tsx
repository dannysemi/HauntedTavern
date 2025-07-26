'use client';
import { useChatEngine } from './chat-engine';
import { Message } from 'ai/react';
import ReactMarkdown, { type Components } from 'react-markdown';
import { PencilSquareIcon, TrashIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { markdownComponents, parseContent } from './curios/markdown-utils';
import { LLMParamsMenu } from './curios/llm-params-menu';

export function ChatInterface() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: isPending,
    editingId,
    editContent,
    messagesEndRef,
    handleSaveEdit,
    handleDeleteMessage,
    handleStartEdit,
    llmParams,
    isParamsMenuOpen,
    toggleParamsMenu
  } = useChatEngine();

  const userName = process.env.NEXT_PUBLIC_USER_NAME || "Traveler";
  const assistantName = process.env.NEXT_PUBLIC_ASSISTANT_NAME || "Tavern Keeper";

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-[#221818]">
      <header className="sticky top-0 z-10 p-4 border-b border-[#5c2d2d] bg-[#2a1414] flex justify-between items-center">
        <h1 className="text-xl font-medium text-[#e8c8a0] font-serif tracking-wider">
          Haunted Tavern
        </h1>
        <button onClick={toggleParamsMenu} className="p-1 text-[#d4a76a] hover:text-[#e8c8a0]">
          <Cog6ToothIcon className="h-6 w-6" />
        </button>
      </header>

      <LLMParamsMenu
        params={llmParams}
        onParamsChange={(newParams) => {}}
        isOpen={isParamsMenuOpen}
        onClose={toggleParamsMenu}
      />

      <div className="flex-1 overflow-y-auto px-4 pb-4 min-h-0">
        <div className="space-y-6 pt-4">
          {messages.map((message, index) => {
            const { text, reasoning } = parseContent(
                typeof message.content === 'string'
                  ? message.content
                  : JSON.stringify(message.content)
            );

            return (
              <div key={index} className="group relative mb-4">
                {/* Message header */}
                <div className="text-sm font-medium mb-1 text-[#d4a76a] font-serif">
                  {message.role === 'user' ? userName : assistantName}
        </div>

                {editingId === index ? (
                  /* Edit mode */
                  <div className="relative mb-4">
                    <textarea
                      value={editContent}
                      onChange={(e) => handleStartEdit(index, e.target.value)}
                      className="w-full p-2 rounded bg-[#3a2020] text-[#e8d5b5] border border-[#5c2d2d]"
                      rows={4}
                    />
                    <button
                      onClick={() => handleSaveEdit(index)}
                      className="mt-2 px-3 py-1 bg-[#5c2d2d] text-[#e8c8a0] rounded hover:bg-[#8a4b4b]"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  /* Display mode */
                  <>
                    <div className="prose prose-sm prose-invert text-[#e8d5b5]">
                      <ReactMarkdown components={markdownComponents}>
                        {text}
                      </ReactMarkdown>
                    </div>

                    {/* Reasoning dropdown */}
                    {reasoning && (
                      <details className="mt-2">
                        <summary className="text-sm text-[#c49c6b] cursor-pointer hover:text-[#d4a76a] font-serif">
                          Whispered Thoughts
                        </summary>
                        <div className="mt-2 p-2 bg-[#3a2020] rounded prose prose-sm prose-invert text-[#d4b58c]">
                          <ReactMarkdown components={markdownComponents}>
                            {reasoning}
                          </ReactMarkdown>
                        </div>
                      </details>
                    )}

                    {/* Edit/Delete buttons */}
                    <div className="absolute -bottom-2 -right-0 flex gap-1">
                      <button
                        onClick={() => handleStartEdit(index, text)}
                        className="p-1 text-[#d4a76a] opacity-0 group-hover:opacity-100"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(index)}
                        className="p-1 text-[#c49c6b] opacity-0 group-hover:opacity-100"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                )}
    </div>
  );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {isPending && (
        <div className="sticky bottom-20 z-0 px-4 pb-2">
          <div className="text-sm text-[#c49c6b] font-serif italic">
            <div className="inline-block bg-[#3a2020] px-3 py-2 rounded-lg">
              {assistantName} is pondering...
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="sticky bottom-0 z-10 p-4 border-t border-[#5c2d2d] bg-[#2a1414]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Speak your mind..."
            className="flex-1 p-3 rounded bg-[#3a2020] text-[#e8d5b5] border border-[#5c2d2d] focus:outline-none focus:ring-1 focus:ring-[#8a4b4b]"
            disabled={isPending}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#5c2d2d] text-[#e8c8a0] rounded hover:bg-[#8a4b4b]"
            disabled={isPending || !input.trim()}
          >
            Say
          </button>
        </div>
      </form>
    </div>
  );
}
