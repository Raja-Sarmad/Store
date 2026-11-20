import InfoPage from "@/components/InfoPage";

export default function DeliveryPage() {
  return (
    <InfoPage
      eyebrow="Order support"
      title="Delivery"
      description="We deliver across Pakistan. Delivery charges depend on whether your address is in Karachi."
      sections={[
        {
          title: "Delivery charges",
          text: "Within Karachi the delivery charge is Rs 300. For every other city in Pakistan the delivery charge is Rs 350. The fee is calculated from the city you enter at checkout and added to your order total before you place the order.",
        },
        {
          title: "Delivery estimate",
          text: "Your order confirmation includes the current estimated delivery date. Estimates can change due to the destination, courier capacity, or other delays. You can check the latest order status in your account.",
        },
        {
          title: "Make sure your address is right",
          text: "Enter a complete address, the correct city name, and a phone number that the courier can reach. If you need to correct delivery details after placing an order, contact us as soon as possible and include your order number.",
        },
        {
          title: "Payment",
          text: "Cash on delivery is currently available. Please have the confirmed order total ready when your parcel arrives.",
        },
      ]}
    />
  );
}
