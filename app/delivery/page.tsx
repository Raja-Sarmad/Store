import InfoPage from "@/components/InfoPage";

export default function DeliveryPage() {
  return <InfoPage eyebrow="Order support" title="Delivery" description="Choose a delivery speed at checkout and follow your order from your account." sections={[
    { title: "Choose your delivery speed", text: "Standard, express, and next-day options are available at checkout. Availability depends on the delivery address. The store calculates the standard delivery charge and adds any express or next-day surcharge to your order total before it is placed." },
    { title: "Delivery estimate", text: "Your order confirmation includes the current estimated delivery date. Estimates can change due to the destination, courier capacity, or other delays. You can check the latest order status in your account." },
    { title: "Make sure your address is right", text: "Enter a complete address and a phone number that the courier can reach. If you need to correct delivery details after placing an order, contact us as soon as possible and include your order number." },
    { title: "Payment", text: "Cash on delivery is currently available. Please have the confirmed order total ready when your parcel arrives." },
  ]} />;
}
