import React from "react";
import { useSearchParams } from "react-router-dom";
import CustomerRegister from "./CustomerRegister";
import CompanyRegister from "./CompanyRegister";

export default function Register() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "customer";

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#f7f6f5] px-4 py-16">
      {type === "company" ? <CompanyRegister /> : <CustomerRegister />}
    </section>
  );
}
