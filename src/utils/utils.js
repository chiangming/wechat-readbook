export function px2rem (px) {
  const ratio = 375 / 10
  return realPx(px) / ratio
}

export function realPx (px) {
  const maxWidth = window.innerWidth > 500 ? 500 : window.innerWidth
  return px * (maxWidth / 375)
}

export function addCss (href) {
  const link = document.createElement('link')
  link.setAttribute('rel', 'stylesheet')
  link.setAttribute('type', 'text/css')
  link.setAttribute('href', href)
  document.getElementsByTagName('head')[0].appendChild(link)
}

export function removeCss (href) {
  const link = document.getElementsByTagName('link')
  for (var i = link.length; i >= 0; i--) {
    if (link[i] && link[i].getAttribute('href') != null && link[i].getAttribute('href').indexOf(href) !== -1) {
      link[i].parentNode.removeChild(link[i])
    }
  }
}

export function removeAllCss () {
  removeCss(`${process.env.VUE_APP_THEME_URL}/theme_default.css`)
  removeCss(`${process.env.VUE_APP_THEME_URL}/theme_eye.css`)
  removeCss(`${process.env.VUE_APP_THEME_URL}/theme_gold.css`)
  removeCss(`${process.env.VUE_APP_THEME_URL}/theme_night.css`)
}
