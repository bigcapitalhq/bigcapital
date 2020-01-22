const title = 'Ratteb';

export const getPageTitle = (pageTitle) => {
  if (pageTitle) {
    return `${pageTitle} - ${title}`;
  }
  return title;
}

// const clipboardSuccess = () => {
//   Vue.prototype.$message({
//     message: 'Copy successfully',
//     type: 'success',
//     duration: 1500,
//   });
// };

// const clipboardError = () => {
//   Vue.prototype.$message({
//     message: 'Copy failed',
//     type: 'error',
//   });
// };

export const handleClipboard = (text, event) => {
  // const clipboard = new Clipboard(event.target, {
  //   text: () => text
  // })
  // clipboard.on('success', () => {
  //   clipboardSuccess()
  //   clipboard.destroy()
  // })
  // clipboard.on('error', () => {
  //   clipboardError()
  //   clipboard.destroy()
  // })
  // clipboard.onClick(event)
}


