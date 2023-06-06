export async function copyText(text: string) {
  let item = new ClipboardItem({
    'text/plain': text
  })

  return navigator.clipboard.write([item])
}
