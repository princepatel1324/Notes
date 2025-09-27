import React, { useState, useEffect } from 'react';
import { GlossaryTerm } from '../services/aiService';

interface GlossaryHighlighterProps {
  content: string;
  glossaryTerms: GlossaryTerm[];
  className?: string;
}

const GlossaryHighlighter: React.FC<GlossaryHighlighterProps> = ({ 
  content, 
  glossaryTerms, 
  className = '' 
}) => {
  const [hoveredTerm, setHoveredTerm] = useState<GlossaryTerm | null>(null);
  const [highlightedContent, setHighlightedContent] = useState<string>('');

  useEffect(() => {
    if (!glossaryTerms.length) {
      setHighlightedContent(content);
      return;
    }

    let processedContent = content;
    
    // Sort terms by position (descending) to avoid position shifts when replacing
    const sortedTerms = [...glossaryTerms].sort((a, b) => b.position - a.position);
    
    sortedTerms.forEach((term) => {
      const termRegex = new RegExp(`\\b${term.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      processedContent = processedContent.replace(termRegex, (match) => {
        return `<span 
          class="glossary-term bg-yellow-200/30 border-b-2 border-yellow-400 cursor-help transition-all duration-200 hover:bg-yellow-300/50" 
          data-term="${encodeURIComponent(JSON.stringify(term))}"
          title="${term.definition}"
        >${match}</span>`;
      });
    });

    setHighlightedContent(processedContent);
  }, [content, glossaryTerms]);

  const handleMouseEnter = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('glossary-term')) {
      try {
        const termData = JSON.parse(decodeURIComponent(target.getAttribute('data-term') || ''));
        setHoveredTerm(termData);
      } catch (error) {
        console.error('Error parsing term data:', error);
      }
    }
  };

  const handleMouseLeave = () => {
    setHoveredTerm(null);
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
      {hoveredTerm && (
        <div className="absolute z-50 bg-gray-900 text-white p-3 rounded-lg shadow-lg border border-gray-700 max-w-xs pointer-events-none transform -translate-y-2">
          <div className="text-sm font-semibold text-yellow-400 mb-1">
            {hoveredTerm.term}
          </div>
          <div className="text-xs text-gray-300 leading-relaxed">
            {hoveredTerm.definition}
          </div>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default GlossaryHighlighter;
