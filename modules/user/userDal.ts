import { Address, User } from "@gen/masterTypes"

const address: Address[] = [{
  uniqueId: "sd824jsdaXuu8q",
  pincode: 721134,
  district: "Purba Medinipur",
  state: "WB"
}, {
  uniqueId: "j4syrej&jdsytep23",
  pincode: 560099,
  district: "Bangalore",
  state: "KA"
}, {
  uniqueId: "y37201nssak1e",
  pincode: 820001,
  district: "Dhanbad",
  state: "JH"
}, {
  uniqueId: "lauq934j",
  pincode: 752001,
  district: "Puri",
  state: "OD"
}]

const data: User[] = [{
  name: "Anudeep",
  email: "anudeepch.paul@gmail.com",
  uniqueId: "sd824jsdaXuu8q"
}, {
  name: "Shreya",
  email: "mrs.shreyapaul@gmail.com",
  uniqueId: "j4syrej&jdsytep23"
}, {
  name: "AnuShreya",
  email: "anushreya@gmail.com",
  uniqueId: "y37201nssak1e"
}, {
  name: '',
  email: '',
  uniqueId: "lauq934j"
}]

export function getUserDetailsByAll(id: string) {
  return data.filter(el => el.name?.includes(id) || el.email?.includes(id) || el.uniqueId?.includes(id))
}

export function getUserAddress(userId: string) {
  return address.filter(add => add.uniqueId === userId)[0]
}
