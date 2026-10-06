import InfoPage from "@/components/InfoPage";

export default function FaqPage() {
  return <InfoPage eyebrow="Need to know" title="FAQs" description="Quick answers for shopping, checkout, and delivery." sections={[
    { title: "How do I place an order?", text: "Add items to your bag, choose the size where required, then continue to checkout. Sign in or create an account to place and track an order." },
    { title: "Which payment methods can I use?", text: "Cash on delivery is currently available at checkout. The confirmed total, including delivery and any applicable tax, is shown after the store processes your order." },
    { title: "How much is delivery?", text: "Delivery charges are calculated using the store's current settings and destination. Express and next-day delivery show their additional charges when you select them." },
    { title: "How can I track an order?", text: "Sign in and open your account to view your orders and the latest available status. Contact support if you need help with an order." },
    { title: "Can I return or exchange an item?", text: "Contact us with your order number before sending an item back. We will review the request and confirm the available options and return instructions." },
  ]} />;
}
