import Link from "next/link";
import Header from "@/components/common/header/DefaultHeader";
import MobileMenu from "@/components/common/header/MobileMenu";
import Footer from "@/components/common/footer/Footer";

export default function LegalPageFallback({ title }) {
  return (
    <>
      <Header />
      <MobileMenu />
      <main className="container py-5">
        <h1>{title}</h1>
        <p>Documentul este momentan indisponibil.</p>
        <Link href="/contact">Contactează-ne pentru informații</Link>
      </main>
      <footer className="footer_one">
        <div className="container">
          <div className="row">
            <Footer />
          </div>
        </div>
      </footer>
    </>
  );
}
