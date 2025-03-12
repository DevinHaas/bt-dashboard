export default function getNameFromEmailadress(email_adress: string) {
  const namePart = email_adress.split("@")[0];
  return namePart.includes(".") ? namePart.split(".")[0] : namePart;
}
