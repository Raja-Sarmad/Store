import InfoPage from "@/components/InfoPage";

export default function TermsPage() {
  return <InfoPage eyebrow="Store information" title="Terms of use" description="A few straightforward terms for using the Overdose online store." sections={[
    { title: "Product listings", text: "We aim to keep descriptions, images, prices, and availability current. Colors can appear differently across screens, and stock is checked again when an order is placed." },
    { title: "Orders", text: "Submitting checkout details creates an order request. The store checks item availability and calculates the final total, including delivery and applicable tax. Orders may be limited or declined if an item is unavailable or details cannot be confirmed." },
    { title: "Your account", text: "Keep your account information accurate and your sign-in details private. Use your account to view order information and contact support if something looks wrong." },
    { title: "Changes and questions", text: "Product availability, prices, and store options may change. If you have a question about an order or these terms, contact our team before proceeding." },
  ]} />;
}
