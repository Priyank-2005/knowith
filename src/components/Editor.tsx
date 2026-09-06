import React, { useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function Editor({ value, onChange, className }: EditorProps) {
  const editor = useRef(null);

  const config = useMemo(() => ({
    readonly: false,
    height: 500,
    theme: 'default',
    enableDragAndDropFileToEditor: true,
    uploader: {
      insertImageAsBase64URI: true
    },
    controls: {
      font: {
        list: {
          'sans-serif': 'Sans Serif',
          'serif': 'Serif',
          'monospace': 'Monospace',
          'var(--font-display)': 'Fraunces (Display)',
          'var(--font-body)': 'Manrope (Body)',
        }
      }
    }
  }), []);

  return (
    <div className={className}>
      <JoditEditor
        ref={editor}
        value={value}
        config={config}
        onBlur={newContent => onChange(newContent)}
      />
    </div>
  );
}
