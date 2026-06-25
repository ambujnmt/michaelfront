'use client'

import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

const modules = {
  toolbar: [
    [{ heading: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'link'],
    [{ align: [] }],
    ['clean'],
  ],
}

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'blockquote', 'link', 'align',
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
