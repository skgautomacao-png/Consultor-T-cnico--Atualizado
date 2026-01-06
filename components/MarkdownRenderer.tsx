
import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="text-sm md:text-base leading-relaxed text-gray-800 space-y-4">
      {renderContentWithTables(content)}
    </div>
  );
};

const renderContentWithTables = (text: string) => {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let tableRows: string[] = [];
  let inTable = false;

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    const isTableLine = trimmed.startsWith('|') && trimmed.endsWith('|');

    if (isTableLine) {
      if (!inTable) {
        inTable = true;
      }
      tableRows.push(trimmed);
    } else {
      if (inTable) {
        elements.push(<TableBlock key={`table-${i}`} rows={tableRows} />);
        tableRows = [];
        inTable = false;
      }
      if (trimmed !== '') {
        elements.push(
          <div key={`p-${i}`} className="mb-2 min-h-[1em] flex flex-wrap items-center gap-2">
            {parseInlineMarkdown(line)}
          </div>
        );
      }
    }
  });

  if (inTable && tableRows.length > 0) {
    elements.push(<TableBlock key="table-end" rows={tableRows} />);
  }

  return elements;
};

const parseInlineMarkdown = (text: string) => {
  // Regex to match images ![alt](url) and bold text **text**
  const tokens = text.split(/(!\[.*?\]\(.*?\))|(\*\*.*?\*\*)/g);
  
  return tokens.map((token, j) => {
    if (!token) return null;

    // Handle Images: ![alt](url)
    if (token.startsWith('![') && token.includes('](')) {
      const altMatch = token.match(/!\[(.*?)\]/);
      const urlMatch = token.match(/\((.*?)\)/);
      const alt = altMatch ? altMatch[1] : '';
      const url = urlMatch ? urlMatch[1] : '';

      // Check if it's the mascot image
      const isMascot = alt.toLowerCase().includes('mascote') || url.includes('jAm2QjF');

      if (isMascot) {
        return (
          <div key={j} className="inline-flex items-center">
            <div className="w-10 h-10 rounded-full border border-red-200 p-0.5 bg-white shadow-sm overflow-hidden flex items-center justify-center">
               <img src={url} alt={alt} className="w-full h-full object-contain" />
            </div>
          </div>
        );
      }
      
      return <img key={j} src={url} alt={alt} className="inline-block max-h-48 rounded-lg my-2 border border-gray-200" />;
    }

    // Handle Bold: **text**
    if (token.startsWith('**') && token.endsWith('**')) {
      const content = token.slice(2, -2);
      // Custom styling for the header "ESPECIALISTA SK-G DIZ:"
      if (content.toLowerCase().includes('especialista sk-g diz')) {
        return (
          <strong key={j} className="font-black text-[#1e3a8a] italic uppercase tracking-wider text-sm md:text-base ml-1">
            {content}
          </strong>
        );
      }
      return <strong key={j} className="font-bold text-gray-900">{content}</strong>;
    }

    return <span key={j}>{token}</span>;
  });
};

const TableBlock: React.FC<{ rows: string[] }> = ({ rows }) => {
  const dataRows = rows.filter(r => !r.includes('---'));
  if (dataRows.length === 0) return null;

  const headers = dataRows[0].split('|').filter(c => c.trim() !== '').map(c => c.trim());
  const bodyRows = dataRows.slice(1).map(r => r.split('|').filter(c => c.trim() !== '').map(c => c.trim()));

  return (
    <div className="overflow-x-auto my-4 border border-gray-300 rounded-lg shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((h, idx) => (
              <th key={idx} scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200 last:border-r-0">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bodyRows.map((row, rIdx) => (
            <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="px-6 py-4 whitespace-normal text-sm text-gray-700 border-r border-gray-200 last:border-r-0">
                   {parseInlineMarkdown(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MarkdownRenderer;
