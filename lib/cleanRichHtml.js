// Text pasted into the admin editor often joins words with &nbsp;, which leaves
// the browser no place to wrap except mid-word. Turn them back into normal spaces
// so lines only ever break between whole words.
export default function cleanRichHtml(html) {
  return (html || '').replace(/&nbsp;| /g, ' ')
}
