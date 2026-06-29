"use client";

import { FormEvent, useState } from "react";
import { useLanguage } from "./LanguageProvider";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const { t } = useLanguage();
  const l = t("formLabels").split("|"), options = t("formOptions").split("|"), a = t("formActions").split("|");
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSent(true); }
  if (sent) return <div className="form-success" role="status"><span className="success-icon">✓</span><h3>{a[2]}</h3><p>{a[3]}</p><button className="text-button" onClick={() => setSent(false)}>{a[4]}</button></div>;
  return <form className="contact-form" onSubmit={submit}><div className="form-row"><label>{l[0]}<input name="name" autoComplete="name" placeholder="João Silva" required/></label><label>{l[1]}<input name="restaurant" autoComplete="organization" placeholder="Restaurante Lisboa" required/></label></div><div className="form-row"><label>{l[2]}<input name="email" type="email" autoComplete="email" placeholder="joao@restaurant.pt" required/></label><label>{l[3]}<input name="phone" type="tel" autoComplete="tel" placeholder="+351 900 000 000"/></label></div><label>{l[4]}<select name="interest" defaultValue=""><option value="" disabled>{l[5]}</option>{options.map((option) => <option key={option}>{option}</option>)}</select></label><label>{l[6]} <span>({l[7]})</span><textarea name="message" rows={4} placeholder={l[8]}/></label><button className="button button-full" type="submit">{a[0]} <span aria-hidden="true">→</span></button><p className="form-note">{a[1]}</p></form>;
}
