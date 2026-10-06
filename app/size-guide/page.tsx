import InfoPage from "@/components/InfoPage";

export default function SizeGuidePage() {
  return <InfoPage eyebrow="Find your fit" title="Size guide" description="Sizing can vary between brands and styles. Check each product before adding it to your bag." sections={[
    { title: "Start with the product", text: "Product pages show the sizes available for that item. Some pieces use letter sizing, while others may use a one-size or unstitched format." },
    { title: "Compare with a garment you own", text: "For the closest fit, compare the product's published measurements with a similar garment you already like. Check whether measurements refer to the garment or the body." },
    { title: "Between sizes?", text: "Review the fit notes and fabric details on the product page. If you are unsure, contact us with the product name and your usual size before ordering." },
    { title: "Brand differences", text: "Xenia, Afrozeh, Jazmine, Alizeh, Frasaha, Nishat, Sapphire, Khaadi, and Zellbury can each size differently. Use the measurements listed for the selected product rather than relying on a single universal chart." },
  ]} />;
}
