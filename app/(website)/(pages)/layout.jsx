import Header from '../../components/website/Header'
import Footer from '../../components/website/Footer'

export default function PagesLayout({ children }) {
  return (
    <div className="page-wraper">
      <Header />
      {children}
      <Footer />
    </div>
  )
}
