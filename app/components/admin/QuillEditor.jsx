'use client'

import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'link', 'image'],
    [{ align: [] }],
    ['clean'],
  ],
  clipboard: {
    // Pasting from Word/Google Docs otherwise injects extra empty
    // paragraphs and drops content, making paste look like it "does nothing".
    matchVisual: false,
  },
}

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'blockquote', 'link', 'align', 'image',
]

export default function QuillEditor({ value, onChange, placeholder }) {
  return (
    <div style={{ color: '#e2e8f0' }}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || 'Write content here...'}
      />
    </div>
  )
}
