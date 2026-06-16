import Script from 'next/script'

export const metadata = {
  title: 'michaelleber',
  description: 'Michael Leber Immobilien',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* GOOGLE FONTS */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

        {/* CSS FILES */}
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/fontawesome/css/font-awesome.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
        <link rel="stylesheet" href="/assets/css/flaticon.min.css" />
        <link rel="stylesheet" href="/assets/css/animate.min.css" />
        <link rel="stylesheet" href="/assets/css/owl.carousel.min.css" />
        <link rel="stylesheet" href="/assets/css/bootstrap-select.min.css" />
        <link rel="stylesheet" href="/assets/css/magnific-popup.min.css" />
        <link rel="stylesheet" href="/assets/css/loader.min.css" />
        <link rel="stylesheet" href="/assets/css/style.css" />
        <link rel="stylesheet" href="/assets/css/custom.css" />
        <link rel="stylesheet" href="/assets/css/skin/skin-1.css" />
        <link rel="stylesheet" href="/assets/css/switcher.css" />
        <link rel="stylesheet" href="/assets/plugins/revolution/revolution/css/settings.css" />
        <link rel="stylesheet" href="/assets/plugins/revolution/revolution/css/navigation.css" />
        <link rel="stylesheet" href="/assets/css/responsive.css" />
      </head>
      <body id="bg" suppressHydrationWarning>
        {children}

        {/* JAVASCRIPT FILES */}
        <Script src="/assets/js/jquery-3.6.1.min.js" strategy="beforeInteractive" />
        <Script src="/assets/js/popper.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/bootstrap.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/bootstrap-select.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/jquery.bootstrap-touchspin.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/magnific-popup.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/waypoints.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/counterup.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/waypoints-sticky.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/isotope.pkgd.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/imagesloaded.pkgd.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/owl.carousel.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/scrolla.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/custom.js" strategy="afterInteractive" />
        <Script src="/assets/js/shortcode.js" strategy="afterInteractive" />
        <Script src="/assets/js/switcher.js" strategy="afterInteractive" />
        {/* Revolution Slider Core */}
        <Script src="/assets/plugins/revolution/revolution/js/jquery.themepunch.tools.min.js" strategy="afterInteractive" />
        <Script src="/assets/plugins/revolution/revolution/js/jquery.themepunch.revolution.min.js" strategy="afterInteractive" />
        <Script src="/assets/plugins/revolution/revolution/js/extensions/revolution-plugin.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
