import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Footer, Palestrantes, ParaQuem, Reflexao, Temas } from "@/components/Sections";
import { Inscricao } from "@/components/Inscricao";
import { Faq } from "@/components/Faq";
import { MobileBar } from "@/components/MobileBar";
import { RevealObserver } from "@/components/RevealObserver";

export default function Home() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-bronze focus:px-5 focus:py-3 focus:font-semibold focus:text-ink"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <Reflexao />
        <Temas />
        <Palestrantes />
        <ParaQuem />
        <Inscricao />
        <Faq />
      </main>
      <Footer />
      <MobileBar />
      <RevealObserver />
    </>
  );
}
