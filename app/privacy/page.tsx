import InfoPage from "@/components/InfoPage";

export default function PrivacyPage() {
  return <InfoPage eyebrow="Store information" title="Privacy" description="How information you provide is used while shopping with Overdose." sections={[
    { title: "Information you provide", text: "When you create an account, place an order, or contact us, you may provide details such as your name, email address, phone number, and delivery address." },
    { title: "Using your information", text: "We use the information you submit to manage your account, process and deliver orders, provide order support, and respond to your requests." },
    { title: "Order and account access", text: "Your order history is available through your signed-in account. Keep your sign-in details private and contact us if you believe someone has accessed your account." },
    { title: "Questions or updates", text: "For questions about your account information or this notice, contact our team through the contact page." },
  ]} />;
}
