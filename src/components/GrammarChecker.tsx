import React, { useState, useEffect } from 'react';
import { GrammarError } from '../services/aiService';

interface GrammarCheckerProps {
  content: string;
  grammarErrors: GrammarError[];
  className?: string;
}

const GrammarChecker: React.FC<GrammarCheckerProps> = ({ 
  content, 
  grammarErrors, 
  className = '' 
}) => {
  const [hoveredError, setHoveredError] = useState<GrammarError | null>(null);
  const [highlightedContent, setHighlightedContent] = useState<string>('');

  useEffect(() => {
    if (!grammarErrors.length) {
      setHighlightedContent(content);
      return;
    }

    let processedContent = content;
    
    // Sort errors by position (descending) to avoid position shifts when replacing
    const sortedErrors = [...grammarErrors].sort((a, b) => b.position - a.position);
    
    sortedErrors.forEach((error) => {
      const errorRegex = new RegExp(`\\b${error.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      processedContent = processedContent.replace(errorRegex, (match) => {
        return `<span 
          class="grammar-error border-b-2 border-red-400 cursor-help transition-all duration-200 hover:bg-red-100/30" 
          data-error="${encodeURIComponent(JSON.stringify(error))}"
          title="Grammar suggestion: ${error.suggestion}"
        >${match}</span>`;
      });
    });

    setHighlightedContent(processedContent);
  }, [content, grammarErrors]);

  const handleMouseEnter = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('grammar-error')) {
      try {
        const errorData = JSON.parse(decodeURIComponent(target.getAttribute('data-error') || ''));
        setHoveredError(errorData);
      } catch (error) {
        console.error('Error parsing error data:', error);
      }
    }
  };

  const handleMouseLeave = () => {
    setHoveredError(null);
  };

  return (
    <div className="relative">
      <div 
        className={className}
        dangerouslySetInnerHTML={{ __html: highlightedContent }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      
      {/* Tooltip */}
      {hoveredError && (
        <div className="absolute z-50 bg-red-900 text-white p-3 rounded-lg shadow-lg border border-red-700 max-w-xs pointer-events-none transform -translate-y-2">
          <div className="text-sm font-semibold text-red-300 mb-1">
            Grammar Suggestion
          </div>
          <div className="text-xs text-gray-300 leading-relaxed mb-2">
            <span className="line-through text-red-400">{hoveredError.text}</span>
          </div>
          <div className="text-xs text-green-300">
            <span className="font-medium">Suggested:</span> {hoveredError.suggestion}
          </div>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-900"></div>
        </div>
      )}
    </div>
  );
};

export default GrammarChecker;
