"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { Icon } from "@/components/Icons";
import { useLanguage } from "@/components/LanguageProvider";
import styles from "@/app/mobile-app/mobile-app.module.css";

const englishQuestions = [
  {
    title: "How many orders does your restaurant receive per week?",
    options: ["Less than 100", "100–300", "300–700", "700+"],
  },
  {
    title: "What percentage of your orders come from delivery marketplaces?",
    options: ["Less than 25%", "25–50%", "50–75%", "More than 75%"],
  },
  {
    title: "Do you currently have your own branded mobile app?",
    options: ["Yes", "No", "We only have a website", "We use WhatsApp or Instagram"],
  },
  {
    title: "Do you collect customer phone numbers or emails?",
    options: ["Yes, consistently", "Sometimes", "Rarely", "No"],
  },
  {
    title: "Do you use loyalty rewards or customer campaigns?",
    options: ["Yes, actively", "Sometimes", "We tried before", "No"],
  },
  {
    title: "What is your biggest growth priority right now?",
    options: ["More direct orders", "More repeat customers", "Lower marketplace commissions", "Stronger restaurant brand"],
  },
];

const portugueseQuestions = [
  { title: "Quantos pedidos recebe o seu restaurante por semana?", options: ["Menos de 100", "100–300", "300–700", "700+"] },
  { title: "Que percentagem dos seus pedidos vem de plataformas de entrega?", options: ["Menos de 25%", "25–50%", "50–75%", "Mais de 75%"] },
  { title: "Tem atualmente uma aplicação móvel própria com a marca do restaurante?", options: ["Sim", "Não", "Temos apenas um website", "Utilizamos WhatsApp ou Instagram"] },
  { title: "Recolhe números de telefone ou emails dos clientes?", options: ["Sim, de forma consistente", "Às vezes", "Raramente", "Não"] },
  { title: "Utiliza recompensas de fidelização ou campanhas para clientes?", options: ["Sim, ativamente", "Às vezes", "Já experimentámos", "Não"] },
  { title: "Qual é a sua principal prioridade de crescimento neste momento?", options: ["Mais pedidos diretos", "Mais clientes recorrentes", "Reduzir comissões das plataformas", "Fortalecer a marca do restaurante"] },
];

const copy = {
  en: {
    language: "Language", welcomeKicker: "Free Restaurant Growth Assessment", welcomeTitle: "Free Restaurant Growth Assessment", welcomeText: "Discover how much your restaurant could increase direct orders and reduce its dependency on delivery platforms.",
    benefits: ["Personalized report", "Free strategy session", "Only 60 seconds", "No commitment"], start: "Start Free Assessment", existing: "Already have your own app? Book a Free Strategy Demo",
    trust: ["Used by restaurants in Portugal", "No commitment", "Your data stays private"], question: "Question", of: "of", back: "Back", next: "Next", calculate: "Calculate My Score",
    calculatingKicker: "Building your report", calculatingTitle: "Analyzing your restaurant...", calculating: ["Checking direct order opportunity", "Calculating loyalty readiness", "Reviewing marketplace dependency", "Preparing your Growth Score"],
    previewKicker: "Assessment complete", previewTitle: "Your Growth Score is ready.", potential: "High growth potential", previewMessage: "Good news — your restaurant has strong potential to increase direct orders.", unlockFull: "Unlock Full Report", previewNote: "Includes direct order opportunity, loyalty readiness and marketplace dependency risk.",
    unlockKicker: "Full report ready", unlockTitle: "Unlock your personalized report", unlockText: "Enter your details to see your full Restaurant Growth Score and recommended Action Plan.", receives: "When you complete the assessment, you receive:", value: ["Personalized report", "Action Plan", "Free 30-minute strategy session with a Cangujet specialist"],
    fullName: "Full name", restaurant: "Restaurant name", phone: "Phone / WhatsApp", email: "Email", unlock: "Unlock My Report", privacy: "We will never share your information.", backPreview: "Back to score preview",
    sending: "Sending...", sendError: "We couldn't send your details. Please try again.",
    fullReport: "Full report", reportTitle: "Restaurant Growth Score", finalScore: "Your final score", direct: "Direct Order Opportunity", loyalty: "Loyalty Readiness", risk: "Marketplace Dependency Risk", estimated: "Estimated Direct Order Opportunity", insight: "Your restaurant has strong potential to increase direct orders by building its own branded mobile app and loyalty program.", action: "Get My Action Plan",
    congrats: "Congratulations!", actionSub: "You have unlocked your Free Strategy Session.", during: "During the session we will:", actionItems: ["Analyze your report", "Identify opportunities", "Show you how to increase direct orders", "Answer your questions"], book: "Book Free Strategy Session", backReport: "Back to report",
  },
  pt: {
    language: "Idioma", welcomeKicker: "Avaliação gratuita", welcomeTitle: "Avaliação Gratuita de Crescimento para Restaurantes", welcomeText: "Descubra quanto o seu restaurante pode aumentar os pedidos diretos e reduzir a dependência das plataformas de entrega.",
    benefits: ["Relatório personalizado", "Sessão estratégica gratuita", "Apenas 60 segundos", "Sem compromisso"], start: "Iniciar Avaliação Gratuita", existing: "Já tem uma aplicação própria? Agendar Sessão Estratégica Gratuita",
    trust: ["Utilizado por restaurantes em Portugal", "Sem compromisso", "Os seus dados permanecem privados"], question: "Pergunta", of: "de", back: "Voltar", next: "Seguinte", calculate: "Calcular a Minha Pontuação",
    calculatingKicker: "A preparar o seu relatório", calculatingTitle: "A analisar o seu restaurante...", calculating: ["A verificar oportunidades de pedidos diretos", "A calcular a preparação para fidelização", "A analisar a dependência das plataformas", "A preparar a sua Pontuação de Crescimento"],
    previewKicker: "Avaliação concluída", previewTitle: "A sua Pontuação de Crescimento está pronta.", potential: "Elevado potencial de crescimento", previewMessage: "Boas notícias — o seu restaurante tem um forte potencial para aumentar os pedidos diretos.", unlockFull: "Desbloquear Relatório Completo", previewNote: "Inclui oportunidade de pedidos diretos, preparação para fidelização e risco de dependência das plataformas.",
    unlockKicker: "Relatório completo pronto", unlockTitle: "Desbloqueie o seu relatório personalizado", unlockText: "Introduza os seus dados para consultar a Pontuação de Crescimento completa e o Plano de Ação recomendado.", receives: "Ao concluir a avaliação recebe:", value: ["Relatório personalizado", "Plano de ação", "Sessão estratégica gratuita de 30 minutos com um especialista Cangujet"],
    fullName: "Nome completo", restaurant: "Nome do restaurante", phone: "Telefone / WhatsApp", email: "Email", unlock: "Desbloquear o Meu Relatório", privacy: "Nunca partilharemos as suas informações.", backPreview: "Voltar à pré-visualização",
    sending: "A enviar...", sendError: "Não foi possível enviar os seus dados. Por favor, tente novamente.",
    fullReport: "Relatório completo", reportTitle: "Pontuação de Crescimento do Restaurante", finalScore: "A sua pontuação final", direct: "Oportunidade de Pedidos Diretos", loyalty: "Preparação para Fidelização", risk: "Risco de Dependência das Plataformas", estimated: "Oportunidade Estimada de Pedidos Diretos", insight: "O seu restaurante tem um forte potencial para aumentar os pedidos diretos através de uma aplicação móvel própria e de um programa de fidelização.", action: "Ver o Meu Plano de Ação",
    congrats: "Parabéns!", actionSub: "Desbloqueou a sua Sessão Estratégica Gratuita.", during: "Durante a sessão iremos:", actionItems: ["Analisar o seu relatório", "Identificar oportunidades", "Mostrar como aumentar pedidos diretos", "Responder às suas dúvidas"], book: "Agendar Sessão Gratuita", backReport: "Voltar ao relatório",
  },
};

type Lead = { name: string; restaurant: string; phone: string; email: string };

function calculateScores(answers: Record<number, string>, questions: typeof englishQuestions) {
  // Larger restaurants, heavier marketplace use and no owned app create more direct-order upside.
  const orderValue = [45, 60, 78, 95][questions[0].options.indexOf(answers[0])] ?? 45;
  const marketplaceIndex = Math.max(0, questions[1].options.indexOf(answers[1]));
  const marketplaceRisk = [25, 50, 75, 95][marketplaceIndex];
  const appOpportunity = [5, 22, 16, 19][Math.max(0, questions[2].options.indexOf(answers[2]))];
  const directOpportunity = Math.min(96, 42 + marketplaceIndex * 11 + appOpportunity);

  // Consistent customer data and active rewards make a restaurant more loyalty-ready.
  const dataReadiness = [92, 65, 38, 15][Math.max(0, questions[3].options.indexOf(answers[3]))];
  const rewardsReadiness = [92, 62, 36, 12][Math.max(0, questions[4].options.indexOf(answers[4]))];
  const loyaltyReadiness = Math.round((dataReadiness + rewardsReadiness) / 2);
  const growthScore = Math.round(directOpportunity * 0.45 + loyaltyReadiness * 0.3 + orderValue * 0.25);
  const estimatedOpportunity = Math.min(45, 16 + marketplaceIndex * 6 + (answers[2] === questions[2].options[0] ? 0 : 6));

  return { growthScore, directOpportunity, loyaltyReadiness, marketplaceRisk, estimatedOpportunity };
}

export function MobileAppLanding() {
  const { setLocale } = useLanguage();
  const [assessmentLanguage, setAssessmentLanguage] = useState<"pt" | "en">("pt");
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [lead, setLead] = useState<Lead>({ name: "", restaurant: "", phone: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const hasTrackedLead = useRef(false);

  useEffect(() => {
    if (currentStep !== 7) return;
    const timer = window.setTimeout(() => setCurrentStep(8), 2000);
    return () => window.clearTimeout(timer);
  }, [currentStep]);

  const questionIndex = currentStep - 1;
  const isLeadComplete = Object.values(lead).every((value) => value.trim().length > 0);
  const c = copy[assessmentLanguage];
  const questions = assessmentLanguage === "pt" ? portugueseQuestions : englishQuestions;
  const scores = calculateScores(answers, questions);

  function changeLanguage(language: "pt" | "en") {
    setAssessmentLanguage(language);
    setLocale(language === "pt" ? "pt-PT" : "en");
    setAnswers({});
    if (currentStep > 0 && currentStep < 7) setCurrentStep(1);
  }

  function nextQuestion() {
    if (!answers[questionIndex]) return;
    setCurrentStep(currentStep === 6 ? 7 : currentStep + 1);
  }

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLeadComplete || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/assessment-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...lead,
          language: assessmentLanguage === "pt" ? "Português" : "English",
          answers: questions.map((question, index) => ({ question: question.title, answer: answers[index] })),
        }),
      });
      if (!response.ok) throw new Error("Lead delivery failed");
      if (!hasTrackedLead.current) {
        window.fbq?.("track", "Lead");
        hasTrackedLead.current = true;
      }
      setCurrentStep(11);
    } catch (error) {
      console.error(error);
      setSubmitError(c.sendError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main id="top" className={styles.page}>
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <BrandMark />
          <label className={styles.languageSwitcher}><span>{c.language}</span><select value={assessmentLanguage} onChange={(e) => changeLanguage(e.target.value as "pt" | "en")}><option value="pt">Português</option><option value="en">English</option></select></label>
        </div>
      </header>

      <section className={styles.assessmentShell} aria-live="polite">
        <div className={styles.backgroundGlow} aria-hidden="true" />

        {currentStep === 0 && (
          <div className={`${styles.card} ${styles.welcomeCard}`}>
            <span className={styles.kicker}>{c.welcomeKicker}</span><h1>{c.welcomeTitle}</h1><p>{c.welcomeText}</p>
            <ul className={styles.benefits}>
              {c.benefits.map((item) => (
                <li key={item}><span><Icon name="check" size={15} /></span>{item}</li>
              ))}
            </ul>
            <button className={styles.primaryButton} type="button" onClick={() => setCurrentStep(1)}>
              {c.start} <Icon name="arrow" size={18} />
            </button>
            <a className={styles.secondaryLink} href="mailto:sales@cangujet.com">{c.existing}</a><TrustRow items={c.trust} />
          </div>
        )}

        {currentStep >= 1 && currentStep <= 6 && (
          <div className={`${styles.card} ${styles.questionCard}`}>
            <div className={styles.progressMeta}>
              <span>{c.question} {currentStep} {c.of} 6</span>
              <strong>{Math.round((currentStep / 6) * 100)}%</strong>
            </div>
            <div className={styles.progressTrack} aria-label={`${Math.round((currentStep / 6) * 100)}% complete`}>
              <span style={{ width: `${(currentStep / 6) * 100}%` }} />
            </div>
            <h1>{questions[questionIndex].title}</h1>
            <div className={styles.options} role="group" aria-label={questions[questionIndex].title}>
              {questions[questionIndex].options.map((option, index) => {
                const selected = answers[questionIndex] === option;
                return (
                  <button
                    type="button"
                    className={styles.option}
                    aria-pressed={selected}
                    key={option}
                    onClick={() => setAnswers({ ...answers, [questionIndex]: option })}
                  >
                    <span>{String.fromCharCode(65 + index)}</span>
                    <strong>{option}</strong>
                    <i aria-hidden="true"><Icon name="check" size={16} /></i>
                  </button>
                );
              })}
            </div>
            <div className={styles.navigation}>
              <button className={styles.backButton} type="button" onClick={() => setCurrentStep(currentStep - 1)}>{c.back}</button>
              <button className={styles.nextButton} type="button" disabled={!answers[questionIndex]} onClick={nextQuestion}>
                {currentStep === 6 ? c.calculate : c.next} <Icon name="arrow" size={17} />
              </button>
            </div>
          </div>
        )}

        {currentStep === 7 && (
          <div className={`${styles.card} ${styles.calculatingCard}`}>
            <div className={styles.loader} aria-hidden="true"><span /></div>
            <span className={styles.kicker}>{c.calculatingKicker}</span><h1>{c.calculatingTitle}</h1>
            <ul>
              {c.calculating.map((item) => (
                <li key={item}><Icon name="check" size={17} />{item}</li>
              ))}
            </ul>
          </div>
        )}

        {currentStep === 8 && (
          <div className={`${styles.card} ${styles.previewResultsCard}`}>
            <span className={styles.kicker}>{c.previewKicker}</span><h1>{c.previewTitle}</h1>
            <div className={styles.previewScore}>
              <strong>{scores.growthScore} <small>/ 100</small></strong>
              <span>{c.potential}</span>
            </div>
            <div className={styles.previewScoreTrack} aria-label={`Growth Score: ${scores.growthScore} out of 100`}>
              <i style={{ width: `${scores.growthScore}%` }} />
            </div>
            <p className={styles.previewMessage}>{c.previewMessage}</p>
            <button className={styles.primaryButton} type="button" onClick={() => setCurrentStep(9)}>
              {c.unlockFull} <Icon name="arrow" size={18} />
            </button>
            <small className={styles.previewNote}>{c.previewNote}</small><TrustRow items={c.trust} />
          </div>
        )}

        {currentStep === 9 && (
          <form className={`${styles.card} ${styles.unlockCard}`} onSubmit={submitLead}>
            <div className={styles.reportReady}><Icon name="shield" size={26} /></div>
            <span className={styles.kicker}>{c.unlockKicker}</span><h1>{c.unlockTitle}</h1><p>{c.unlockText}</p>
            <div className={styles.valueStack}><strong>{c.receives}</strong>{c.value.map((item) => <span key={item}><Icon name="check" size={15} />{item}</span>)}</div>
            <div className={styles.formGrid}>
              <label>{c.fullName}<input required name="name" autoComplete="name" value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} /></label>
              <label>{c.restaurant}<input required name="restaurant" autoComplete="organization" value={lead.restaurant} onChange={(e) => setLead({ ...lead, restaurant: e.target.value })} /></label>
              <label>{c.phone}<input required type="tel" name="phone" autoComplete="tel" value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })} /></label>
              <label>{c.email}<input required type="email" name="email" autoComplete="email" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} /></label>
            </div>
            <button className={styles.primaryButton} type="submit" disabled={!isLeadComplete || isSubmitting}>{isSubmitting ? c.sending : c.unlock} {!isSubmitting && <Icon name="arrow" size={18} />}</button>
            {submitError && <p className={styles.formError} role="alert">{submitError}</p>}
            <small><Icon name="shield" size={13} /> {c.privacy}</small><button className={styles.secondaryLink} type="button" onClick={() => setCurrentStep(8)}>{c.backPreview}</button>
          </form>
        )}

        {currentStep === 10 && (
          <div className={`${styles.card} ${styles.resultsCard}`}>
            <span className={styles.kicker}>{c.fullReport} · {lead.restaurant}</span><h1 className={styles.reportTitle}>{c.reportTitle}</h1>
            <div className={styles.scoreHero}>
              <div><span>{c.finalScore}</span><strong>{scores.growthScore} <small>/ 100</small></strong></div>
              <div className={styles.scoreRing} style={{ "--score": `${scores.growthScore * 3.6}deg` } as React.CSSProperties} aria-hidden="true"><Icon name="chart" size={28} /></div>
            </div>
            <div className={styles.resultGrid}>
              <article><span>{c.direct}</span><strong>{scores.directOpportunity}%</strong><i><b style={{ width: `${scores.directOpportunity}%` }} /></i></article>
              <article><span>{c.loyalty}</span><strong>{scores.loyaltyReadiness}%</strong><i><b style={{ width: `${scores.loyaltyReadiness}%` }} /></i></article>
              <article><span>{c.risk}</span><strong>{scores.marketplaceRisk}%</strong><i><b style={{ width: `${scores.marketplaceRisk}%` }} /></i></article>
            </div>
            <div className={styles.opportunityBox}><span>{c.estimated}</span><strong>+{scores.estimatedOpportunity}%</strong></div><p className={styles.insight}>{c.insight}</p>
            <button className={styles.primaryButton} type="button" onClick={() => setCurrentStep(11)}>{c.action} <Icon name="arrow" size={18} /></button>
          </div>
        )}

        {currentStep === 11 && (
          <div className={`${styles.card} ${styles.actionCard}`}>
            <div className={styles.demoIcon}><Icon name="phone" size={28} /></div>
            <span className={styles.kicker}>Action Plan</span><h1>{c.congrats}</h1><p>{c.actionSub}</p>
            <div className={styles.recommendationCard}>
              <span>{c.during}</span>
              <ul>
                {c.actionItems.map((item) => (
                  <li key={item}><i><Icon name="check" size={15} /></i>{item}</li>
                ))}
              </ul>
            </div>
            <a className={styles.primaryButton} href="mailto:sales@cangujet.com">{c.book} <Icon name="arrow" size={18} /></a><button className={styles.secondaryLink} type="button" onClick={() => setCurrentStep(10)}>{c.backReport}</button>
          </div>
        )}
      </section>
    </main>
  );
}

function TrustRow({ items }: { items: string[] }) {
  return <div className={styles.trustRow}>{items.map((item) => <span key={item}><Icon name="shield" size={12} />{item}</span>)}</div>;
}
