if (process.env.NODE_ENV === 'development') {
  import('@welldone-software/why-did-you-render').then(({ default: whyDidYouRender }) => {
    if (whyDidYouRender) {
      whyDidYouRender(React, { trackAllPureComponents: false });
    }
  });
}
