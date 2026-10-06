import InfoPage from "@/components/InfoPage";

export default function ReturnsPage() {
  return <InfoPage eyebrow="Order support" title="Returns & exchanges" description="Need help with an order? Contact us first so we can guide you through the right next step." sections={[
    { title: "Start a request", text: "Contact our team with your order number, the item you need help with, and a short description of the issue. We will review the order and confirm the available return or exchange options before you send anything back." },
    { title: "Keep the item in its original condition", text: "Please keep tags, packaging, and any included accessories together while your request is being reviewed. Eligibility can depend on the item and its condition." },
    { title: "Wait for return instructions", text: "Our team will share the return address and next steps after reviewing your request. Parcels sent without return instructions may be delayed or difficult to match to an order." },
    { title: "Refunds and exchanges", text: "Once an approved return is received and checked, our team will confirm the available resolution and timing with you directly." },
  ]} />;
}
