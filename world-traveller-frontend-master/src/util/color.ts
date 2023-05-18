export const getRandomColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

export const getRandomTailwindColorClassName = (prefix: string) => {
  const allTailwindV3_2Colors = [
    "red",
    "orange",
    "yellow",
    "green",
    "teal",
    "blue",
    "indigo",
    "purple",
    "pink",
    "gray",
    "cool-gray",
    "blue-gray",
    "true-gray",
    "warm-gray",
    "amber",
    "lime",
    "emerald",
    "cyan",
    "light-blue",
    "violet",
    "fuchsia",
    "rose",
    "sky",
    "light-green",
    "warm-gray",
    "cool-gray",
    "blue-gray",
    "true-gray",
    "gray",
  ];
  const intensity = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"];

  const randomColorIndex = Math.floor(Math.random() * allTailwindV3_2Colors.length);
  const randomIntensityIndex = Math.floor(Math.random() * intensity.length);

  return `${prefix || "bg"}-${allTailwindV3_2Colors[randomColorIndex]}-${intensity[randomIntensityIndex]}`;
};
